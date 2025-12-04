import axios from "axios";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Kota {
  id: string;
  lokasi: string;
}

export default function SearchPages() {
  const [search, setSearch] = useState("");
  const [cities, setCities] = useState<Kota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://api.myquran.com/v2/sholat/kota/semua")
      .then((res) => {
        setCities(res.data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = cities.filter((city) =>
    city.lokasi.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchWrapper}>
        <TextInput
          placeholder="Cari kota..."
          placeholderTextColor="#888"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {loading ? (
        <View style={styles.centerLoader}>
          <ActivityIndicator size="large" color="#11A145" />
        </View>
      ) : (
        <ScrollView style={styles.listContainer}>
          {filtered.length > 0 ? (
            filtered.map((city) => (
              <TouchableOpacity
                key={city.id}
                style={styles.cityItem}
                onPress={() =>
                  router.push({
                    pathname: "/",
                    params: { cityName: city.lokasi },
                  })
                }
              >
                <Text style={styles.cityName}>{city.lokasi}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.noResults}>Kota tidak ditemukan</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f1f1",
  },
  searchWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: -5,
  },
  searchInput: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  cityItem: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  cityName: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  centerLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noResults: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
});
