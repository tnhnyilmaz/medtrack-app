import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import { Image, View } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import styles from "../../styles/HomeScreenStyles";

const AppBar = () => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.header}>
      <View style={styles.imgContainer}>
        <Image
          source={{
            uri: "https://thumbs.dreamstime.com/b/unknown-man-profile-avatar-vector-male-office-icon-potrait-175425661.jpg",
          }}
          style={styles.img}
          resizeMode="cover"
        />
      </View>
      <AntDesign name="setting" size={24} color={colors.text} />
    </View>
  );
};

export default AppBar;