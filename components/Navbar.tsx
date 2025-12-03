import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface NavbarProps {
  active: "search" | "home" | "calendar";
  onPress?: (page: "search" | "home" | "calendar") => void;
}

export default function Navbar({ active, onPress }: NavbarProps) {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, active === "search" && styles.activeButton]}
          onPress={() => onPress?.("search")}
        >
          <Image
            source={require("../assets/images/Vector.png")}
            style={[styles.icon, active === "search" && styles.activeIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.buttonCenter,
            active === "home" && styles.activeButtonCenter,
          ]}
          onPress={() => onPress?.("home")}
        >
          <Image
            source={require("../assets/images/Vector (1).png")}
            style={[styles.icon, active === "home" && styles.activeIcon]}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, active === "calendar" && styles.activeButton]}
          onPress={() => onPress?.("calendar")}
        >
          <Image
            source={require("../assets/images/Vector (2).png")}
            style={[styles.icon, active === "calendar" && styles.activeIcon]}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#11A145",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 35,
    borderRadius: 40,
    marginBottom: 25,
    alignItems: "center",
  },

  button: {
    padding: 10,
    borderRadius: 12,
  },

  buttonCenter: {
    padding: 12,
    borderRadius: 14,
  },

  activeButton: {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },

  activeButtonCenter: {
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  icon: {
    width: 22,
    height: 22,
    tintColor: "white",
  },

  activeIcon: {
    tintColor: "white",
  },
});
