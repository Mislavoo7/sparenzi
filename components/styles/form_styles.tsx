const input = {
  height: 40,
  borderColor: '#fff',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 10,
  color: 'white',
  backgroundColor: '#333',
};

export const formStyles = {
  container: {
    gap: 8,
  },
  modalOverlay: {
    minWidth: 400,
    minHeight: 350,
    flex: 1,
    top: 210,
    backgroundColor: '#151718',
  },
  modalContent: {
    top: 0,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginRight: 6,
    paddingBottom: 6,
    paddingHorizontal: 6,
  },
  xBttn: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  loginForm: {
    position: 'relative',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    width: '95%', // Use full width of modal content
    alignSelf: 'stretch', // Ensures it stretches in flex layouts
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: 'white',
  },
  inputLogin: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  inputEuro: {
    ...input,
    width: 70
  },
  inputProductName: {
    ...input,
    width: 115,
    marginLeft: 6
  },
  loginButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "white",
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  currencySelectContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  currencyOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#ccc',
  },
  currencyOptionSelected: {
    backgroundColor: '#007AFF',
  },
  currencyText: {
    fontSize: 16,
    fontWeight: '300',
    color: 'black',
  },
  currencyTextSelected: {
    fontWeight: '900',
    color: 'white',
  },
}
