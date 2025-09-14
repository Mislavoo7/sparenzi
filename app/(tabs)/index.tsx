import { router } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import { Platform, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedDestroyButton } from '@/components/ThemedDestroyButton';
import { ThemedSubmitButton } from '@/components/ThemedSubmitButton';
import { ExternalLink } from '@/components/ExternalLink';
import { PriceList } from '@/components/PriceList';
import { TotalPrice } from '@/components/TotalPrice';
import { AddItemForm } from '@/components/AddItemForm';
import { Navigation } from '@/components/Navigation';
import { AuthContext } from '@/components/account/AuthContext'; 
import { t } from '@/components/helpers/translations';
import { humanizeDate, deHumanizeDate, toDateObj } from '@/components/helpers/humanizeDate';
import { toCent } from '@/components/helpers/humanizePrice';
import { createAppId } from '@/components/helpers/productsHelper';
import apiRoutes from '@/components/helpers/apiRoutes';
import { formStyles } from '@/components/styles/form_styles';

export default function HomeScreen({onDelete, ...otherProps}) {
  const [price, setPrice] = useState('');
  const [productName, setProductName] = useState('');
  const [shopName, setShopName] = useState('');
  const [takenAt, setTakenAt] = useState('');
  const [currency, setCurrency] = useState(global.currency);
  const [company, setCompany] = useState('');
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

const { token, user, updateProfile, isUpdatingProfile } = useContext(AuthContext);

  useEffect(() => {
    const newTotal = rows.reduce((sum, row) => sum + row.price, 0) * 100;
    setTotal(newTotal);
  }, [rows]);

  useEffect(() => {
    if (token && user) {
      updateProfile();
    }
  }, [token]);



  const restructureData = (results) => {
    return results.lists.map((i) => {
      return {
        id: i["id"],
        shopName: i["shop_name"],
        takenAt: i["taken_at"],
        currency: i["currency"],
        totalPriceInCent: i["total_price_in_cent"]
      }
    })
  }

  const resetInputs = () => {
    setPrice('');
    setProductName('');
    setCompany('');
  };

  const handleAddRow = () => {
    if (!price || !productName) return; // Prevent empty rows

    const row = {
      id: createAppId(),
      price: parseFloat(price),
      productName,
      company,
    };

    setRows([...rows, row]);
    resetInputs(); 
  }

  const handleClear = () => {
    setRows([]);
    resetInputs(); 
  }

  const handleSubmit = async () => {
    if (!shopName.trim() || !takenAt.trim() || !currency.trim()) {
      Alert.alert(t("fields.fill_in_all_fields"));
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.listsIndex}/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          list: {
            shop_name: shopName,
            currency: currency,
            taken_at: deHumanizeDate(selectedDate),
            products_attributes: rows.map(row => ({
              company: row.company,
              price_in_cent: toCent(row.price), 
              product_name: row.productName
            }))
          }
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Close modal and reset form
      setIsOpen(false);
      setShopName('');
      setCurrency(global.currency)
      setTakenAt('');
      handleClear();
      setSelectedDate(new Date()); 

      const result = await response.json();
      router.push(`/lists/${result["list"]["id"]}`)
    } catch (err) {
      console.error('Error updating item:', err);
      setError(err.message);
      Alert.alert(t("loading_failed"));
    } finally {
      setLoading(false);
    }
  }

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }

    if (date) {
      setSelectedDate(date);
      setTakenAt(humanizeDate(date));
    }
  };

  const handleNewListOpen = (itemId="", itemShopName="", itemTakenAt="") => {
    if (token) {
      setIsOpen(!isOpen);
      setShopName("");

      const today = new Date();
      setSelectedDate(today);
      setTakenAt(humanizeDate(today));
    } else {
      Alert.alert( t("need_login_to_save_list") );
    } 
  }

  const onDestroy = (id) => {
    setRows(rows => rows.filter(item => parseInt(item.id) !== parseInt(id)));
  }

  return (
    <ParallaxScrollView>
      <Navigation />

      {isOpen ? (
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => handleNewListOpen("", "", "")} 
        >
          <ThemedView style={styles.modalOverlay}>
            <ThemedView style={styles.loginForm}>
             <ThemedView style={styles.titleContainer}>
                <ThemedText type={"subtitle"}> {t("buttons.save_list")} </ThemedText>
                <ThemedDestroyButton onPress={() => handleNewListOpen("", "", "")} />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type={"default"}>{t("lists.fields.shop_name")}</ThemedText>
                <TextInput
                  style={styles.inputLogin}
                  placeholder={t("lists.fields.placeholder_shop_name")}
                  value={shopName}
                  onChangeText={setShopName}
                  keyboardType="default"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type={"default"}>{t("lists.fields.currency")}</ThemedText>
                <ThemedView style={styles.currencySelectContainer}>
                  <TouchableOpacity
                    style={[
                      styles.currencyOption,
                      currency === '$' && styles.currencyOptionSelected
                    ]}
                    onPress={() => setCurrency('$')}
                    disabled={loading}
                  >
                    <ThemedText 
                      type={"default"} 
                      style={[
                        styles.currencyText,
                        currency === '$' && styles.currencyTextSelected
                      ]}
                    >
                      $
                    </ThemedText>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.currencyOption,
                      currency === '€' && styles.currencyOptionSelected
                    ]}
                    onPress={() => setCurrency('€')}
                    disabled={loading}
                  >
                    <ThemedText 
                      type={"default"} 
                      style={[
                        styles.currencyText,
                        currency === '€' && styles.currencyTextSelected
                      ]}
                    >
                      €
                    </ThemedText>
                  </TouchableOpacity>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.inputContainer}>
                <ThemedText type={"default"}>{t("lists.fields.taken_at")}</ThemedText>
                <TouchableOpacity 
                  style={styles.inputLogin}
                  onPress={showDatePickerModal}
                >
                  <ThemedText type={"default"} style={{color: "black" }}> {takenAt || humanizeDate(new Date())} </ThemedText>
                </TouchableOpacity>
              </ThemedView>

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

                <ThemedSubmitButton 
                 textWaiting = {`${t("lists.sending")}...`}
                 text = {t("lists.send")}
                 onPress={handleSubmit}
                 loading={loading}
                />
            </ThemedView>
          </ThemedView>
        </Modal>
      ) : null}

      {rows.length ? (
        <>
        <ThemedView style={styles.textsContainer}>
          <ThemedText type={"subtitle"}>{t("title")}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.buttonsContainer}>
          <ThemedButton 
            onPress={handleNewListOpen} 
            style={token ? {} : {disabled: true} }
            text={t("buttons.save_list")} 
          />
          <ThemedButton 
            onPress={handleClear} 
            text={t("buttons.clear_list")} 
          />
        </ThemedView>
        </>
      ) : (
        <ThemedView style={styles.textsContainer}>
          <ThemedText type={"subtitle"}>{t("title")}</ThemedText>
          <ThemedText>{t("tagline")}</ThemedText>
        </ThemedView>
      )}

      <TotalPrice data={total} currency={global.currency} />

      <AddItemForm
        price={price}
        productName={productName}
        company={company}
        onPriceChange={setPrice}
        onProductNameChange={setProductName}
        onCompanyChange={setCompany}
        onAddRow={handleAddRow}
      />

      <PriceList 
        data={rows}
        onDelete={onDestroy} 
      />

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    position: 'flex',
    gap: 8,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 10,
  },
  textsContainer: {
    position: 'block',
    zIndex: 10,
  },
  ...formStyles,
});

