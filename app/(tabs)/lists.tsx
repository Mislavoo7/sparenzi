import { router } from 'expo-router';
import React, { useState, useEffect, useContext } from 'react';
import { FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Modal, TextInput, Platform} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedDestroyButton } from '@/components/ThemedDestroyButton';
import { ThemedSubmitButton } from '@/components/ThemedSubmitButton';
import { ThemedListButton } from '@/components/ThemedListButton';
import { Navigation } from '@/components/Navigation';
import { AuthContext } from '@/components/account/AuthContext'; 
import { Pagination } from '@/components/Pagination'; 
import { t } from '@/components/helpers/translations';
import { humanizeDate, deHumanizeDate, toDateObj } from '@/components/helpers/humanizeDate';
import { humanizePrice } from '@/components/helpers/humanizePrice';
import apiRoutes from '@/components/helpers/apiRoutes';
import { formStyles } from '@/components/styles/form_styles';
import useTheme from '@/components/styles/colors';

export default function ListsScreen() {
  const [data, setData] = useState([]);
  const [id, setId] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [shopName, setShopName] = useState('');
  const [takenAt, setTakenAt] = useState('');
  const [currency, setCurrency] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { token, user } = useContext(AuthContext);

  const isFocused = useIsFocused();

  useEffect(() => {
    fetchData();
  }, [isFocused]);

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

  const handlePagination = (newPage) => {
    setPage(newPage);
    fetchData(newPage);
  };

  const fetchData = async (pageToFetch = page) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.listsIndex}?page=${pageToFetch}`, {
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
      setData(restructureData(result));
      setTotalPages(parseInt(result["total_lists"]))
      setPage(parseInt(result["page"]))
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
  //  console.log(contentOffset.y)
    if (contentOffset.y == 0) {
      fetchData();
    }
  };

  const handleOpenEdit = (itemId="", itemShopName="", itemTakenAt="", itemCurrency="") => {
    setIsOpen(!isOpen);
    setId(itemId);
    setShopName(itemShopName);
    setCurrency(itemCurrency);

    if (itemTakenAt) {
      const dateObj = toDateObj(itemTakenAt);
      setSelectedDate(dateObj);
      setTakenAt(humanizeDate(dateObj));
    } else {
      const today = new Date();
      setSelectedDate(today);
      setTakenAt(humanizeDate(today));
    }
  }

  const handleSubmit = async () => {
    if (!shopName.trim() || !takenAt.trim() || !currency.trim()) {
      Alert.alert(t("lists.errors.error"), t("lists.errors.fill_fields"));
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
  
      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.listsIndex}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_name: shopName,
          currency: currency,
          taken_at: deHumanizeDate(selectedDate),
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      setData(restructureData(result));
      
      setIsOpen(false);
      setId('');
      setShopName('');
      setTakenAt('');
      setCurrency('');
      setSelectedDate(new Date()); 
    } catch (err) {
      setError(err.message);
      Alert.alert(t("lists.errors.error"), t("lists.errors.failed_to_update"));
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

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.listsIndex}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(restructureData(result));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id, shopName, takenAt) => {
    Alert.alert(
      t("confirm_delete"),
      `${t("confirm_msgs.delete_list")} ${shopName} ${humanizeDate(takenAt)}?`,
      [
        {
          text: t("buttons.cancel"),
          style: "cancel"
        },
        {
          text: t("buttons.delete"),
          style: "destructive",
          onPress: () => handleDelete(id)
        }
      ]
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <ThemedText type={"default"}>{t("loading_lists")}...</ThemedText>
        </ThemedView>
      );
    }

    if (error && data.length === 0) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ThemedText type={"default"}>{t("loading_failed")}</ThemedText>
          <ThemedText type={"default"}>{error}</ThemedText>
        </ThemedView>
      );
    }

    return (
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ThemedView style={styles.listItem}>
              <ThemedView style={styles.listContent}>
                <ThemedView style={styles.listInfo}>
                  <ThemedText type={"defaultSemiBold"}>{item.shopName}</ThemedText>
                  <ThemedText type={"default"}>
                    {t("date")}: {humanizeDate(item.takenAt)} | {t("total")}: {humanizePrice(item.totalPriceInCent, item.currency)}
                  </ThemedText>
                </ThemedView>
              </ThemedView>

              <ThemedView style={styles.listBttns}>
                <ThemedListButton 
                  onPress={() => router.push(`/lists/${item.id}`)}
                  text = {t("buttons.open")}
                  />

                <ThemedListButton 
                  onPress={() => handleOpenEdit(item.id, item.shopName, item.takenAt, item.currency)}
                  text = {t("buttons.edit")}
                  />

                <ThemedListButton 
                  onPress={() => confirmDelete(item.id, item.shopName, item.takenAt)}
                  text = {t("buttons.delete")}
                  textColor = "#ff6b6b" 
                  />
              </ThemedView>
            </ThemedView>
          )}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={fetchData}
          nestedScrollEnabled={true}
        />
    );
  };

  return (
    <ParallaxScrollView>
      <Navigation />
      <ThemedText type={"title"}> {t("your_lists")} </ThemedText>

      { renderContent() }

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          handlePagination(newPage);
        }}
      />

      {isOpen ? (
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => handleOpenEdit("", "", "")}
        >
          <ThemedView style={styles.modalOverlay}>
              <ThemedView style={styles.loginForm}>
                <ThemedView style={styles.titleContainer}>
                  <ThemedText type={"subtitle"}> {t("buttons.edit")} </ThemedText>
                  <ThemedDestroyButton onPress={() => handleOpenEdit("", "", "")} />
                </ThemedView>

                <ThemedView style={styles.inputContainer}>
                  <ThemedText type={"default"}>{t("lists.fields.placeholder_shop_name")}</ThemedText>
                  <TextInput
                    style={styles.inputLogin}
                    placeholder={t("lists.fields.placeholder_shop_name")}
                    value={shopName}
                    onChangeText={setShopName}
                    keyboardType="text"
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
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  listItem: {
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  listContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listBttns: {
    flexDirection: 'row',
    paddingTop: 12,
    justifyContent: 'left',
    gap: 12,
    alignItems: 'center',
  },
  listInfo: {
    flex: 1,
    marginRight: 12,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  ...formStyles
});
