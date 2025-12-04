import { StyleSheet } from "react-native";

export default StyleSheet.create({
    roundAddBtn: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bigText: {
        fontSize: 28,
        fontWeight: 'bold'
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginVertical: 15,
        height: 60,
    },
    inputText: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#333",
        fontStyle:"italic",
        alignItems:"center"
        
    }
})