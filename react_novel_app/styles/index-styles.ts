import { Theme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";

export const homeStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
  });
};

export const homeHeaderStyles = (theme: Theme) => {
  return StyleSheet.create({
    homeHeader: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      height: 60,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderColor,
      backgroundColor: theme.bgColor,
    },
    homeHeaderLeft: {
      marginRight: "auto",
    },
    headerAct: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      minWidth: 100,
      height: "100%",
      gap: 10,
      padding: 10,
    },
    homeCenter: {
      display: "flex",
      flexDirection: "row",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    homeCenterText: {
      fontWeight: 600,
      color: theme.primaryColor,
      fontSize: RFValue(18),
    },
    homeIconBox: {
      padding: 4,
      borderRadius: 4,
    },
    homeIconBoxActive: {
      backgroundColor: theme.bgSecondaryColor,
    },
  });
};

export const homeContentStyles = (theme: Theme) => {
  return StyleSheet.create({
    homeContent: {
      width: "100%",
      backgroundColor: theme.bgColor,
      flex: 1,
    },
    homeContentInner: {
      padding: 20,
    },
  });
};

export const bookGridStyles = (theme: Theme) => {
  return StyleSheet.create({
    bookRow: {
      display: "flex",
      flexDirection: "row",
      marginBottom: 20,
      gap: 20,
    },
    bookItem: {
      display: "flex",
      width: "30%",
      aspectRatio: 1 / 1.5,
    },
    bookCover: {
      width: "100%",
      flex: 1,
      backgroundColor: theme.bgSecondaryColor,
      borderRadius: 4,
      overflow: "hidden",
    },
    bookTitle: {
      marginTop: 5,
      fontSize: RFValue(13),
      color: theme.textSecondaryColor,
    },
  });
};

export const bookListStyles = (theme: Theme) => {
  return StyleSheet.create({});
};
