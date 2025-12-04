import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  scrollContainer: {
    gap: 20,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  textInput: {
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
  },
  durationInput: {
    flex: 1,
  },
  durationButtons: {
    flex: 4,
    flexDirection: "row",
    gap: 5,
  },
  durationButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  durationButtonText: {
    fontSize: 14,
  },
  timeContainer: {
    marginBottom: 10,
  },
  timeLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  timeButton: {
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  timeButtonText: {
    fontSize: 16,
  },
  foodRow: {
    flexDirection: "row",
    gap: 10,
  },
  foodButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  foodButtonText: {
    fontSize: 16,
  },
  saveButton: {
    borderRadius: 10,
    padding: 18,
    alignItems: "center",
    marginVertical: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    borderRadius: 20,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  timePickerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  timePickerColumn: {
    alignItems: "center",
  },
  timePickerLabel: {
    marginBottom: 10,
  },
  timePickerScroll: {
    height: 120,
  },
  timePickerItem: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
  },
  timePickerItemText: {
    textAlign: "center",
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 20,
  },
  modalButtonRow: {
    flexDirection: "row",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
  },
  modalButtonText: {
    color: "white",
    fontSize: 16,
  },
});