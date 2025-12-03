import axios from "axios";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { JadwalSholat } from "./types/Jadwal";

export default function App() {
  const [jadwal, setJadwal] = useState<JadwalSholat | null>(null);
  const [time, setTime] = useState<string>("");

  // Clock realtime
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Fetch API MyQuran
  useEffect(() => {
    axios
      .get("https://api.myquran.com/v2/sholat/jadwal/0101/2024/12/03")
      .then((res) => setJadwal(res.data.data.jadwal))
      .catch((err) => console.log(err));
  }, []);

  if (!jadwal) return <Text style={{ padding: 20 }}>Loading...</Text>;

  // Card list
  const sholatList = [
    { name: "Subuh", key: "subuh", icon: require("./assets/icons/subuh.png") },
    {
      name: "Dzuhur",
      key: "dzuhur",
      icon: require("./assets/icons/dzuhur.png"),
    },
    { name: "Ashar", key: "ashar", icon: require("./assets/icons/ashar.png") },
    {
      name: "Maghrib",
      key: "maghrib",
      icon: require("./assets/icons/maghrib.png"),
    },
    { name: "Isya", key: "isya", icon: require("./assets/icons/isya.png") },
  ] as const;

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.clock}>{time}</Text>
        <Text style={styles.location}>Bekasi, Jawa Barat</Text>
      </View>

      {/* LIST */}
      {sholatList.map((item) => (
        <View key={item.key} style={styles.card}>
          <View style={styles.left}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.name}>{item.name}</Text>
          </View>

          <Text style={styles.timeText}>{jadwal[item.key]}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "#f1f1f1",
  },

  headerCard: {
    backgroundColor: "#11A145",
    padding: 25,
    borderRadius: 20,
    marginBottom: 20,
  },

  clock: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  location: {
    fontSize: 16,
    color: "#ffffffcc",
    marginTop: 5,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 18,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  icon: {
    width: 32,
    height: 32,
    resizeMode: "contain",
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  timeText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
});
