import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AddItemForm } from '@/components/AddItemForm';
import { ThemedButton } from '@/components/ThemedButton';
import { PriceItem } from '@/components/PriceItem';
import { TotalPrice } from '@/components/TotalPrice';
import { AuthContext } from '@/components/account/AuthContext';
import { Navigation } from '@/components/Navigation';
import { createAppId } from '@/components/helpers/productsHelper';
import { toCent, toBaseUnit } from '@/components/helpers/humanizePrice';
import { t } from '@/components/helpers/translations';
import apiRoutes from '@/components/helpers/apiRoutes';

interface Product {
  id: number;
  company: string;
  price_in_cent: number;
  product_name: string;
  app_id: string;
  list_id: number;
  created_at: string;
  updated_at: string;
}

interface ListDetail {
  id: number;
  shop_name: string;
  taken_at: string;
  total_price_in_cent: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

export default function ListDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [listData, setListData] = useState<ListDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [price, setPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [company, setCompany] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchListData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.listsIndex}/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error('API returned error');
        }

        setListData(restructureListData(result));
        setProducts(restructureProducts(result));

      } catch (error) {
        //console.error('Error fetching list data:', error);
        setError(error instanceof Error ? error.message : t("no_list"));
      } finally {
        setLoading(false);
      }
    };

    fetchListData();
  }, [id, token]);

  const restructureListData = (result: any) => {
    return {
      id: result.list.id,
      shop_name: result.list.shop_name,
      taken_at: result.list.taken_at,
      total_price_in_cent: result.list.total_price_in_cent,
      currency: result.list.currency,
      created_at: result.list.created_at,
      updated_at: result.list.updated_at
    };
  };

  const restructureProducts = (result: any) => {
    return result.products ? result.products.map((p: any) => ({
      id: p.id,
      company: p.company,
      price_in_cent: p.price_in_cent,
      product_name: p.product_name,
      app_id: p.app_id,
      list_id: p.list_id,
      created_at: p.created_at,
      updated_at: p.updated_at
    })) : [];
  };

  const handleDeleteProduct = async (productId: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/lists/${listData.id}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (!response.ok) {
        console.error('API error:', result);
        throw new Error(result?.message || `HTTP error! ${response.status}`);
      }

      if (!result.success) {
        throw new Error('API returned failure');
      }

      setListData(restructureListData(result));
      setProducts(restructureProducts(result));
    } catch (error) {
//      console.error('Error fetching list data:', error);
      setError(error instanceof Error ? error.message : t("no_list"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddRow = async () => { 
    if (!price || !productName) return; // Prevent empty rows

    const priceInCents = toCent(price);
    if (isNaN(priceInCents)) {
      setError(t("forms.enters.enter_price"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/lists/${listData.id}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product: {
            app_id: createAppId(),
            price_in_cent: priceInCents,
            product_name: productName,
            company: company,
          }
        }),
      });

      const responseText = await response.text();

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error(`Non json error ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(result?.message || `HTTP error: ${response.status}`);
      }

      setListData(restructureListData(result));
      setProducts(restructureProducts(result));

      // Clear inputs
      setPrice('');
      setProductName('');
      setCompany('');

    } catch (error) {
      console.error('Error adding product:', error);
      setError(error instanceof Error ? error.message : 'Failed to add product');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.loadingText}>{t("loading_list")}...</ThemedText>
      </ThemedView>
    );
  }

  if (error || !listData) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText style={styles.errorText}> {error || t("no_list")} </ThemedText>
        <ThemedButton 
          onPress={() => router.back()}
          text={t("go_back")}
        />
      </ThemedView>
    );
  }


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <ParallaxScrollView>
        <Navigation />
        <ThemedText style={styles.shopName}>{listData.shop_name}</ThemedText>
        <ThemedText style={styles.date}>{formatDate(listData.taken_at)}</ThemedText>
        <TotalPrice data={listData.total_price_in_cent} currency={listData.currency} />

      <ThemedView style={styles.itemsContainer}>
        <ThemedText style={styles.sectionTitle}> {t("products")} ({products.length}) </ThemedText>

        {products.length === 0 ? (
          <ThemedText style={styles.emptyText}> {t("no_products")} </ThemedText>
        ) : (
          <>
            <AddItemForm
             price={price}
             productName={productName}
             company={company}
             currency={listData.currency}
             onPriceChange={setPrice}
             onProductNameChange={setProductName}
             onCompanyChange={setCompany}
             onAddRow={handleAddRow}
            />
            
            {/* Table Header */}
            <ThemedView style={styles.tableHeader}>
              <ThemedView style={styles.headerColumn}>
                <ThemedText style={styles.headerText}> {t("forms.fields.price")} </ThemedText>
              </ThemedView>
              <ThemedView style={styles.headerColumn}>
                <ThemedText style={styles.headerText}> {t("forms.fields.product")} </ThemedText>
              </ThemedView>
              <ThemedView style={styles.headerColumn}>
                <ThemedText style={styles.headerText}> {t("forms.fields.company")} </ThemedText>
              </ThemedView>
              <ThemedView style={styles.headerColumn}>
                <ThemedText style={styles.headerText}> {t("forms.fields.action")} </ThemedText>
              </ThemedView>
            </ThemedView>

            {/* Product List */}
            {products.map((product) => (
              <PriceItem
                key={product.id}
                id={product.id}
                price={toBaseUnit(product.price_in_cent)}
                productName={product.product_name}
                company={product.company}
                currency={listData.currency}
                onDelete={handleDeleteProduct}
              />
            ))}
          </>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#151718',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  shopName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 4,
  },
  itemsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    marginTop: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    marginBottom: 8,
  },
  headerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    opacity: 0.8,
  },
});
