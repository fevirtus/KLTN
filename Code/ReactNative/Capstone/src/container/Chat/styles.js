import { StyleSheet } from "react-native";
import { color, appStyle } from "../../utility";

export default StyleSheet.create({
  sendMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignContent: "center",
    flex: 1,
    paddingHorizontal: 5,
    position: 'absolute',
    bottom: 10
  },
  input: {
    borderRadius: 20,
    flex: 6,
  },

  sendBtnContainer: {
    height: appStyle.fieldHeight,
    backgroundColor: color.WHITE,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
    width: "15%",
    flex: 1
  },
});
