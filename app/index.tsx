import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Home() {
  const { cityName } = useLocalSearchParams(); // ← Ambil nama kota dari SearchPages

  const city = cityName ? String(cityName) : "Jakarta"; // default

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchPrayerTimes = async () => {
    try {
      const response = await fetch(
        `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=2`
      );
      const json = await response.json();
      setData(json.data);
    } catch (error) {
      console.log("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPrayerTimes();
  }, [city]);

  if (loading || !data) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  const timings = data.timings;
  const date = data.date.readable;

  const prayerList = [
    {
      name: "Fajr",
      icon: require("../assets/images/sunrise.png"),
      time: timings.Fajr,
    },
    {
      name: "Dhuhr",
      icon: require("../assets/images/day.png"),
      time: timings.Dhuhr,
    },
    {
      name: "Asr",
      icon: require("../assets/images/afternoon.png"),
      time: timings.Asr,
    },
    {
      name: "Maghrib",
      icon: require("../assets/images/evening.png"),
      time: timings.Maghrib,
    },
    {
      name: "Isha",
      icon: require("../assets/images/night.png"),
      time: timings.Isha,
    },
  ];

  const hours = new Date().getHours().toString().padStart(2, "0");
  const minutes = new Date().getMinutes().toString().padStart(2, "0");

  return (
    <ScrollView style={styles.container}>
      {/* BIG CARD */}
      <View style={styles.bigCard}>
        <Text style={styles.timeText}>
          {hours} : {minutes}
        </Text>

        <Text style={styles.city}>{city}</Text>

        <Text style={styles.dateText}>{date}</Text>
      </View>

      {/* PRAYER LIST */}
      {prayerList.map((item, index) => (
        <View key={index} style={styles.prayerCard}>
          <Image
            source={item.icon}
            style={{ width: 40, height: 40, resizeMode: "contain" }}
          />

          <Text style={styles.prayerName}>{item.name}</Text>

          <Text style={styles.prayerTime}>{item.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  bigCard: {
    backgroundColor: "#00A23D",
    borderRadius: 30,
    padding: 30,
    marginBottom: 25,
  },

  timeText: {
    fontSize: 45,
    color: "white",
    fontWeight: "bold",
  },

  city: {
    color: "white",
    fontSize: 22,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "right",
  },

  dateText: { marginTop: 10, color: "white", fontSize: 17 },

  prayerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 25,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  prayerName: { flex: 1, fontSize: 20, marginLeft: 15 },

  prayerTime: { fontSize: 20, color: "#888" },
});
