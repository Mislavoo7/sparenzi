const useTheme = (key) => {
  const themeProps = {
    dark: {
      color: "white",
      backgroundColor: "#151718",
      borderColor: "white"
    },
    light: {
      color: "black",
      backgroundColor: "white",
      borderColor: "black"

    }
  }
  const theme = global.theme || "dark"; 

  const styleToReturn = {}
  styleToReturn[`${key}`] = themeProps[theme][key]
  return styleToReturn
} 
export default useTheme;


//const linkColor = useThemeColor({ light: '#0a7ea4', dark: '#4CC9FF' }, 'tint');

