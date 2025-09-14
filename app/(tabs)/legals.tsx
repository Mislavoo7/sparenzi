import React, { useState, useEffect } from 'react';
import { StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Navigation } from '@/components/Navigation';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import apiRoutes from '@/components/helpers/apiRoutes';
import { ThemedButton } from '@/components/ThemedButton';
import { t } from '@/components/helpers/translations';
import languages  from '@/components/helpers/translations';

interface LegalPageContent {
  id: number;
  name: string;
  body: string;
  record_type: string;
  record_id: number;
  created_at: string;
  updated_at: string;
}

interface LegalPageTranslation {
  title: string;
  content: LegalPageContent;
  created_at: string;
  updated_at: string;
}

interface LegalPage {
  id: number;
  slug: string;
  hr: LegalPageTranslation;
  en: LegalPageTranslation;
  de: LegalPageTranslation;
}

interface ApiResponse {
  success: boolean;
  legal_pages: LegalPage[];
}

export default function Legals() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState(global.language);

  const [selectedPageId, setSelectedPageId] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${apiRoutes.baseUrl}/${apiRoutes.legalsIndex}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse = await response.json();

      if (result.success) {
        setLegalPages(result);
        setSelectedPage(getSelectedPage(global.language, 0, result));
      } else {
        throw new Error('Failed to fetch legal pages');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      Alert.alert('Error', 'Failed to load legal pages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSelectedPage = (language = global.language, pageId = 0, pages = legalPages) => {
    const key = language.toLowerCase() 

    // preselect page
    if (!pageId) {
      const translation = pages["legal_pages"][0][key];
      return translation;
    }

    return legalPages["legal_pages"].find((page) => parseInt(page["id"]) == parseInt(pageId))[key] 
  };

  const renderHtmlContent = (htmlString: string) => {
    return htmlString
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim();
  };

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode);
    setSelectedPage(getSelectedPage(langCode, selectedPageId));
  };

  const handlePageChange = (pageId) => {
    setSelectedPageId(pageId);
    setSelectedPage(getSelectedPage(selectedLanguage, pageId));
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator size="large" color="white" />
          <ThemedText> { t("loading") } </ThemedText>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.container}>
      {/* language  bttn */}
        <ThemedView style={styles.languageRow}>
          {languages.map(language => (
            <ThemedButton
            key={language.code}
            text={language.label}
            onPress={() => handleLanguageChange(language.code)}
            disabled={loading}
            style={{selected: selectedLanguage.toLowerCase() == language.code}}
            />
          ))}
        </ThemedView>

      {/* title bttns */}
        <ThemedView style={styles.pagesRow}>
          {legalPages["legal_pages"].map((page, index) => {
            const key = selectedLanguage.toLowerCase() 
            const translation = page[key];
            const isSelected = selectedPageId === page.id || (selectedPageId === null && index === 0);
            
            return (
              <ThemedButton
                key={page.id}
                text={translation.title}
                onPress={() => handlePageChange(page.id)}
                style={{selected: isSelected}}
              />
            );
          })}
        </ThemedView>

        {/* page */}
        {selectedPage && (
          <>
            <ThemedText type={"title"} > {selectedPage.title} </ThemedText>
            <ScrollView showsVerticalScrollIndicator={false}>
              <ThemedText> {renderHtmlContent(selectedPage.content.body)} </ThemedText>
            </ScrollView>
          </>
        )}
      </ThemedView>
    );
  };

  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
    headerImage={null} >
      <Navigation />
      {renderContent()}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  languageRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 12,
  },
  languageButtonSelected: {
    backgroundColor: '#007AFF',
  },
  pagesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    gap: 8,
  },
  pageButtonSelected: {
    backgroundColor: '#007AFF',
  },
});
