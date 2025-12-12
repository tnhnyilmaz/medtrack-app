import { StyleSheet } from "react-native";

export default StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headText: {
        flex: 1,
        marginLeft: -42,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateContainer: {
        marginTop: 20,
        marginBottom: 10,
        borderRadius: 20,
        padding: 5,

    },
    dateTextActive: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 6,
        color: "#fff",
        borderRadius: 12,
    },
    dateTextInactive: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 6,
        borderRadius: 12,
    },
    dateSelection: {
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bloodCard: {
        width: '100%',
        minHeight: 100,
        borderRadius: 16,
        marginTop: 20,
        flexDirection: "row",
        alignItems: 'center',
        gap: 20,
        padding: 15,
        justifyContent: "space-between",
    },
    bloodText: {
        fontSize: 22,
        fontWeight: 'bold',

    },
    textStatus: {
        backgroundColor: '#9e1919ff',
    },
    addBtn: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});