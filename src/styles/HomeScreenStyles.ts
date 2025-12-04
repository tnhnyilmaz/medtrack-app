import { StyleSheet } from "react-native";

export default StyleSheet.create({
    imgContainer: {
        width: 75,
        height: 75,
        borderRadius: 50,
        overflow: 'hidden'
    },
    img: {
        width: '100%',
        height: '100%'
    },
    container: {
        flex: 1,
        padding: 20
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 20,
        gap: 10,
        width: "100%",
    },
    bigText: {
        fontSize: 28,
        fontWeight: "bold",
    },
    mediumText: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 5,
    },
    medContainer: {
        width: '100%',
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 15
    },
    contextTitle: {
        fontSize: 12,
        marginTop: 5,
        fontWeight: '700'
    },
    subContextTitle: {
        fontSize: 14,
    },
    medCheckContainer: {
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    checkboxContainer: {
        width: 16,
        height: 16,
        borderRadius: 4,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: '#007AFF',
        borderColor: '#007AFF',
    },
    checkboxUnchecked: {
        backgroundColor: 'transparent',
        borderColor: '#C7C7CC',
    },
    addBtn: {
        width: "100%",
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',

    },
    addBtnText: {
        fontSize: 16,
        fontWeight: '600',
    },
    measurementsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
    measurementsCard: {
        width: "49%",
        height: 200,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffffff',
    },
    measurementsIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    measurementsTitleText: {
        fontSize: 16,
        fontWeight: '600',
    },
    measurementsValueText: {
        fontSize: 32,
        fontWeight: '700',
    },
    detailText:{
        fontSize:14,
        fontStyle:'italic',
        fontWeight:'500',
    },
    
});