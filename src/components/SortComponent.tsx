import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { useTheme } from '../theme/ThemeContext';

export type SortOption = 'date' | 'priority' | 'title' | 'completed';

interface SortComponentProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const SortComponent: React.FC<SortComponentProps> = ({
  currentSort,
  onSortChange,
}) => {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const sortOptions: Array<{ value: SortOption; label: string; icon: string }> = [
    { value: 'date', label: 'Date Created', icon: '📅' },
    { value: 'priority', label: 'Priority', icon: '⭐' },
    { value: 'title', label: 'Title', icon: '📝' },
    { value: 'completed', label: 'Completion', icon: '✅' },
  ];

  const getCurrentSortLabel = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.label : 'Sort by';
  };

  const getCurrentSortIcon = () => {
    const option = sortOptions.find(opt => opt.value === currentSort);
    return option ? option.icon : '🔀';
  };

  const handleSortSelect = (sort: SortOption) => {
    onSortChange(sort);
    setIsModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          { backgroundColor: theme.colors.surface },
        ]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <Text style={[styles.icon, { color: theme.colors.text }]}>
            {getCurrentSortIcon()}
          </Text>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
            {getCurrentSortLabel()}
          </Text>
          <Text style={[styles.arrow, { color: theme.colors.textSecondary }]}>
            ▼
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsModalVisible(false)}
        >
          <View
            style={[
              styles.modalContent,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Sort by
            </Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {sortOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.sortOption,
                    currentSort === option.value && {
                      backgroundColor: theme.colors.primary + '20',
                    },
                  ]}
                  onPress={() => handleSortSelect(option.value)}
                >
                  <Text style={[styles.sortIcon, { color: theme.colors.text }]}>
                    {option.icon}
                  </Text>
                  <Text
                    style={[
                      styles.sortLabel,
                      {
                        color:
                          currentSort === option.value
                            ? theme.colors.primary
                            : theme.colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  {currentSort === option.value && (
                    <Text
                      style={[
                        styles.checkmark,
                        { color: theme.colors.primary },
                      ]}
                    >
                      ✓
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    marginLeft: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxWidth: 300,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  sortIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  sortLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SortComponent;
