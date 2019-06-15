export enum Colors {
  black = "rgb(0, 0, 0)",
  white = "rgb(255, 255, 255)",

  athens = "rgb(234, 234, 236)",
  manatee = "rgb(142, 142, 156)",

  charade = "rgb(46, 47, 63)",
  charadeOpaque = "rgba(46, 47, 63, 0.7)",
  shark = "rgb(39, 40, 54)",
  woodsmoke = "rgb(32, 33, 45)",

  pastelGreen = "rgb(105, 219, 124)",
  macaroniAndCheese = "rgb(255,192,120)",

  pastelYellow = "rgb(255,219,94)",
  pastelOrange = "rgb(254,177,26)",
  pastelWhite = "rgb(253,249,233)",
  lightBlue = "#e0f6ff",
  blue = "#aae6ff"
}

export enum TextColors {
  black = Colors.black,
  white = Colors.white,

  primary = Colors.athens,
  secondary = Colors.manatee,

  tertiary = Colors.shark
}

export enum BackgroundColors {
  blue = Colors.blue,
  white = Colors.white,
  black = Colors.black,

  primary = Colors.charade,
  secondary = Colors.shark,
  tertiary = Colors.woodsmoke,

  quaternary = Colors.athens,
  quinary = Colors.charadeOpaque,
  senary = Colors.manatee
}

export enum BorderColors {
  primary = Colors.athens,
  secondary = Colors.manatee
}
