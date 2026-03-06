import { StyleSheet } from "react-native";

export default StyleSheet.create({
  screen: {
    flex: 1,
  },
  ambientLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  ambientCircleTop: {
    position: "absolute",
    top: -120,
    right: -95,
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  ambientCircleBottom: {
    position: "absolute",
    bottom: 110,
    left: -130,
    width: 290,
    height: 290,
    borderRadius: 145,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  topBarBackButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  topBarTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  headText: {
    fontSize: 27,
    fontWeight: "800",
    letterSpacing: -0.35,
  },
  topBarSubText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
  },

  dateSelectionContainer: {
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    marginBottom: 8,
  },
  dateSelection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  dateNavButton: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  dateTextWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  dateHint: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.25,
  },

  chartCard: {
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 8,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },
  chartArea: {
    height: 208,
    justifyContent: "center",
  },
  emptyChartWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  emptyChartText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  summaryWrap: {
    marginTop: 10,
    marginBottom: 10,
    gap: 8,
  },
  summaryLegendRow: {
    flexDirection: "row",
    gap: 16,
  },
  summaryLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 11,
    fontWeight: "600",
  },
  summaryCardsRow: {
    flexDirection: "row",
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  summaryCardLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  summaryCardValue: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  trendText: {
    fontSize: 12,
    fontWeight: "600",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingBottom: 20,
    gap: 8,
  },
  listEmptyWrap: {
    marginTop: 24,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 20,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  listEmptyText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  bloodCard: {
    width: "100%",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    paddingRight: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  bloodText: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
  },
  cardMetaText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  expandButton: {
    width: 28,
    height: 28,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  detailWrap: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
  },
  detailText: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },

  addButtonWrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  addBtn: {
    width: "100%",
    minHeight: 54,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 7,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.1,
  },
});
