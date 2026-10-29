export type VehicleModel = { name: string; engines: string[] };
export type VehicleSeries = { name: string; models: VehicleModel[] };

export const VEHICLE_DATA: Record<string, VehicleSeries[]> = {
  BMW: [
    {
      name: "1 Series",
      models: [
        { name: "1 Series (E81/E82/E87/E88) (2004–2013)", engines: [
          "116i — N45 / N43", "118i — N46 / N43", "120i — N46 / N43",
          "125i — N52", "130i — N52", "135i — N54 / N55",
          "116d — N47", "118d — M47 / N47", "120d — M47 / N47",
          "123d — N47 twin-turbo"
        ]},
        { name: "1 Series (F20/F21) (2011–2019)", engines: [
          "114i — N13", "116i — N13 / B38", "118i — N13 / B38",
          "120i — N13 / B48", "125i — N20 / B48", "M135i — N55",
          "M140i — B58", "114d — N47", "116d — N47 / B37",
          "118d — N47 / B47", "120d — N47 / B47", "125d — N47 twin-turbo"
        ]},
        { name: "1 Series (F40) (2019–2024)", engines: [
          "116i — B38", "118i — B38", "120i — B48", "128ti — B48",
          "M135i xDrive — B48", "116d — B37", "118d — B47", "120d — B47",
          "M135i xDrive (facelift markets) — B48"
        ]},
        { name: "1 Series (F70) (2024–present)", engines: [
          "116 — 1.5L turbo petrol (market dependent)", "120 — 1.5L turbo petrol mild-hybrid",
          "123 xDrive — 2.0L turbo petrol mild-hybrid", "M135 xDrive — 2.0L turbo petrol",
          "118d — 2.0L turbo diesel", "120d — 2.0L turbo diesel mild-hybrid"
        ]}
      ]
    },
    {
      name: "2 Series",
      models: [
        { name: "2 Series Coupe (F22) (2013–2021)", engines: [
          "218i — B38", "220i — N20 / B48", "228i — N20", "230i — B48",
          "M235i — N55", "M240i — B58", "220d — N47 / B47",
          "225d — N47 twin-turbo", "M2 — N55 (separate M model)"
        ]},
        { name: "2 Series Convertible (F23) (2014–2021)", engines: [
          "218i — B38", "220i — N20 / B48", "228i — N20", "230i — B48",
          "M235i — N55", "M240i — B58", "220d — N47 / B47"
        ]},
        { name: "2 Series Active Tourer (F45) (2014–2021)", engines: [
          "218i — B38", "220i — B48", "225i xDrive — B48",
          "216d — B37", "218d — B47", "220d — B47",
          "225xe — plug-in hybrid"
        ]},
        { name: "2 Series Gran Tourer (F46) (2015–2022)", engines: [
          "216i — B38", "218i — B38", "220i — B48",
          "216d — B37", "218d — B47", "220d — B47"
        ]},
        { name: "2 Series Gran Coupe (F44) (2019–2024)", engines: [
          "218i — B38", "220i — B48", "M235i xDrive — B48",
          "216d — B37", "218d — B47", "220d — B47"
        ]},
        { name: "2 Series Coupe (G42) (2021–present)", engines: [
          "218i — B38 (selected markets)", "220i — B48", "230i — B48",
          "M240i / M240i xDrive — B58", "220d — B47 (selected markets)"
        ]},
        { name: "2 Series Active Tourer (U06) (2021–present)", engines: [
          "218i — 1.5L turbo petrol", "220i — 1.5L turbo petrol mild-hybrid",
          "223i — 2.0L turbo petrol mild-hybrid", "218d — 2.0L turbo diesel",
          "220d — 2.0L turbo diesel mild-hybrid", "225e xDrive — plug-in hybrid",
          "230e xDrive — plug-in hybrid"
        ]},
        { name: "2 Series Gran Coupe (F74) (2024–present)", engines: [
          "218 Gran Coupe — 1.5L turbo petrol", "220 Gran Coupe — 1.5L turbo petrol mild-hybrid",
          "223 xDrive Gran Coupe — 2.0L turbo petrol mild-hybrid",
          "M235 xDrive Gran Coupe — 2.0L turbo petrol",
          "220d Gran Coupe — 2.0L turbo diesel mild-hybrid"
        ]}
      ]
    },
    {
      name: "3 Series",
      models: [
        { name: "3 Series (E21) (1975–1983)", engines: [
          "315 — M10", "316 — M10", "318 — M10", "320 / 320i — M10 / M20",
          "323i — M20"
        ]},
        { name: "3 Series (E30) (1982–1994)", engines: [
          "316 / 316i — M10 / M40", "318i / 318is — M10 / M40 / M42",
          "320i — M20", "323i — M20", "325i / 325ix — M20",
          "324d / 324td — M21", "M3 — S14"
        ]},
        { name: "3 Series (E36) (1990–2000)", engines: [
          "316i — M40 / M43", "318i / 318is — M42 / M43 / M44",
          "320i — M50 / M52", "323i — M52", "325i — M50",
          "328i — M52", "M3 — S50 / S52", "318tds / 325td / 325tds — M41 / M51"
        ]},
        { name: "3 Series (E46) (1998–2006)", engines: [
          "316i — N40 / N42 / N46", "318i — M43 / N42 / N46",
          "320i — M52 / M54", "323i — M52", "325i — M54",
          "328i — M52", "330i — M54", "M3 — S54",
          "318d — M47", "320d — M47", "330d — M57", "330Cd — M57"
        ]},
        { name: "3 Series (E90/E91/E92/E93) (2005–2013)", engines: [
          "316i — N43", "318i — N46 / N43", "320i — N46 / N43",
          "323i — N52", "325i — N52 / N53", "328i — N52 (selected markets)",
          "330i — N52 / N53", "335i — N54 / N55", "M3 — S65 V8",
          "316d — N47", "318d — M47 / N47", "320d — M47 / N47",
          "325d — M57 / N57", "330d — M57 / N57", "335d — M57"
        ]},
        { name: "3 Series (F30/F31/F34) (2011–2019)", engines: [
          "316i — N13", "318i — B38", "320i — N20 / B48",
          "328i — N20", "330i — B48", "335i — N55", "340i — B58",
          "316d — N47 / B47", "318d — N47 / B47", "320d — N47 / B47",
          "325d — N47 / N57", "330d — N57", "335d — N57",
          "330e — B48 plug-in hybrid", "ActiveHybrid 3 — N55 hybrid"
        ]},
        { name: "3 Series (G20/G21) (2018–present)", engines: [
          "318i — B38 (selected markets)", "320i — B48", "330i — B48",
          "M340i / M340i xDrive — B58", "318d — B47", "320d — B47",
          "330d — B57", "M340d xDrive — B57", "330e — B48 plug-in hybrid"
        ]}
      ]
    },
    {
      name: "4 Series",
      models: [
        { name: "4 Series (F32/F33/F36) (2013–2020)", engines: [
          "418i — B38", "420i — N20 / B48", "428i — N20", "430i — B48",
          "435i — N55", "440i — B58", "M4 — S55",
          "418d — B47", "420d — N47 / B47", "425d — N47 / B47",
          "430d — N57", "435d xDrive — N57"
        ]},
        { name: "4 Series (G22/G23/G26) (2020–present)", engines: [
          "420i — B48", "430i — B48", "M440i / M440i xDrive — B58",
          "M4 — S58", "420d — B47", "430d — B57", "M440d xDrive — B57",
          "i4 eDrive35 — electric", "i4 eDrive40 — electric",
          "i4 xDrive40 — electric", "i4 M50 / M60 xDrive — electric"
        ]}
      ]
    },
    {
      name: "5 Series",
      models: [
        { name: "5 Series (E12) (1972–1981)", engines: [
          "518 — M10", "520 / 520i — M10 / M20", "525 — M30",
          "528 / 528i — M30", "535i — M30"
        ]},
        { name: "5 Series (E28) (1981–1988)", engines: [
          "518i — M10", "520i — M20", "525i — M30", "528i — M30",
          "535i / M535i — M30", "524d / 524td — M21", "M5 — M88 / S38"
        ]},
        { name: "5 Series (E34) (1987–1996)", engines: [
          "518i — M40 / M43", "520i — M20 / M50", "525i — M20 / M50",
          "530i — M30 / M60", "535i — M30", "540i — M60",
          "525td / 525tds — M51", "M5 — S38"
        ]},
        { name: "5 Series (E39) (1995–2003)", engines: [
          "520i — M52 / M54", "523i — M52", "525i — M54",
          "528i — M52", "530i — M54", "535i — M62", "540i — M62",
          "520d — M47", "525tds — M51", "525d / 530d — M57", "M5 — S62"
        ]},
        { name: "5 Series (E60/E61) (2003–2010)", engines: [
          "520i — M54 / N46 / N43", "523i — N52", "525i — M54 / N52 / N53",
          "530i — M54 / N52 / N53", "535i — N54", "540i — N62 (market dependent)",
          "545i / 550i — N62", "520d — M47 / N47", "525d — M57",
          "530d — M57", "535d — M57", "M5 — S85 V10", "ActiveHybrid prototype/market variants"
        ]},
        { name: "5 Series (F10/F11) (2010–2017)", engines: [
          "518i / 520i — N20 (market dependent)", "528i — N20",
          "530i — N53 (market dependent)", "535i — N55", "550i — N63",
          "520d — N47 / B47", "525d — N47 / N57", "530d — N57", "535d — N57",
          "M5 — S63 V8", "ActiveHybrid 5 — N55 hybrid", "530e — not offered in all markets"
        ]},
        { name: "5 Series (G30/G31) (2017–2023)", engines: [
          "520i — B48", "530i — B48", "540i — B58", "M550i xDrive — N63",
          "520d — B47", "530d — B57", "540d — B57", "M550d xDrive — B57 quad-turbo",
          "530e / 545e — plug-in hybrid", "M5 — S63 V8"
        ]},
        { name: "5 Series (G60/G61) (2023–present)", engines: [
          "520i — 2.0L turbo petrol (market dependent)", "530i — 2.0L turbo petrol",
          "530i xDrive — 2.0L turbo petrol", "540i xDrive — 3.0L turbo petrol mild-hybrid",
          "520d — 2.0L turbo diesel mild-hybrid", "523d — 2.0L turbo diesel mild-hybrid",
          "530e — plug-in hybrid", "550e xDrive — plug-in hybrid",
          "i5 eDrive40 — electric", "i5 xDrive40 — electric",
          "i5 M60 xDrive — electric", "M5 — S68 V8 plug-in hybrid (G90/G99)"
        ]}
      ]
    },
    {
      name: "6 Series",
      models: [
        { name: "6 Series Coupe/Convertible (E24) (1976–1989)", engines: [
          "628CSi — M30", "630CS / 630CSi — M30", "633CSi — M30",
          "635CSi — M30", "M635CSi — M88 / S38"
        ]},
        { name: "6 Series (E63/E64) (2003–2010)", engines: [
          "630i — N52 / N53", "645Ci — N62", "650i — N62",
          "635d — M57", "M6 — S85 V10"
        ]},
        { name: "6 Series (F06/F12/F13) (2011–2018)", engines: [
          "640i — N55", "650i — N63", "M6 — S63",
          "640d — N57", "M6 Gran Coupe — S63"
        ]},
        { name: "6 Series Gran Turismo (G32) (2017–2023)", engines: [
          "620d — B47", "630i — B48", "630d — B57",
          "640i — B58", "640d — B57"
        ]}
      ]
    },
    {
      name: "7 Series",
      models: [
        { name: "7 Series (E23) (1977–1986)", engines: [
          "728 / 728i — M30", "730 / 733i — M30", "735i — M30",
          "745i — M30 turbo"
        ]},
        { name: "7 Series (E32) (1986–1994)", engines: [
          "730i — M30 / M60", "735i — M30", "740i — M60",
          "750i / 750iL — M70 V12"
        ]},
        { name: "7 Series (E38) (1994–2001)", engines: [
          "728i — M52", "730i — M60", "735i — M62",
          "740i — M60 / M62", "750i — M73 V12", "725tds — M51", "730d — M57"
        ]},
        { name: "7 Series (E65/E66) (2001–2008)", engines: [
          "730i — M54 / N52", "735i — N62", "740i — N62",
          "745i — N62", "750i — N62", "760i — N73 V12",
          "730d / 740d — M57"
        ]},
        { name: "7 Series (F01/F02) (2008–2015)", engines: [
          "730i — N52 / N53", "740i — N54 / N55", "750i — N63",
          "760i — N74 V12", "730d — N57", "740d — N57",
          "ActiveHybrid 7 — N63 hybrid"
        ]},
        { name: "7 Series (G11/G12) (2015–2022)", engines: [
          "730i — B48", "740i — B58", "750i — N63", "M760Li — N74 V12",
          "730d — B57", "740d — B57", "745e / 750e — plug-in hybrid"
        ]},
        { name: "7 Series (G70) (2022–present)", engines: [
          "735i — 3.0L turbo petrol (market dependent)", "740i / 740i xDrive — B58 mild-hybrid",
          "760i xDrive — V8 (market dependent)", "750e xDrive — plug-in hybrid",
          "M760e xDrive — plug-in hybrid performance", "i7 eDrive50 — electric",
          "i7 xDrive60 — electric", "i7 M70 xDrive — electric"
        ]}
      ]
    },
    {
      name: "8 Series",
      models: [
        { name: "8 Series (E31) (1990–1999)", engines: [
          "840Ci — M60 / M62 V8", "850i / 850Ci — M70 / M73 V12",
          "850CSi — S70 V12"
        ]},
        { name: "8 Series (G14/G15/G16) (2018–present)", engines: [
          "840i — B58", "M850i xDrive — N63 V8", "M8 Competition — S63 V8",
          "840d xDrive — B57 diesel (selected markets)",
          "M8 Gran Coupe — S63 V8", "M8 Convertible — S63 V8"
        ]}
      ]
    },
    {
      name: "Z Series",
      models: [
        { name: "Z1 (1989–1991)", engines: ["Z1 — M20B25 2.5L inline-six"]},
        { name: "Z3 (E36/7/E36/8) (1995–2002)", engines: [
          "1.8i / 1.9i — M43 / M44", "2.0i — M52", "2.2i — M54",
          "2.3i / 2.5i — M52 / M54", "2.8i / 3.0i — M52 / M54",
          "M Roadster / M Coupe — S50 / S52 / S54"
        ]},
        { name: "Z4 (E85/E86) (2002–2008)", engines: [
          "2.0i — N46", "2.2i / 2.5i / 3.0i — M54",
          "3.0si — N52", "Z4 M Roadster / Coupe — S54"
        ]},
        { name: "Z4 (E89) (2009–2016)", engines: [
          "sDrive18i — N20", "sDrive20i — N20", "sDrive23i — N52",
          "sDrive28i — N20", "sDrive30i — N52", "sDrive35i / 35is — N54"
        ]},
        { name: "Z4 (G29) (2018–present)", engines: [
          "sDrive20i — B48", "sDrive30i — B48", "M40i — B58"
        ]}
      ]
    },
    {
      name: "X1",
      models: [
        { name: "X1 (E84) (2009–2015)", engines: [
          "sDrive18i — N46 / N20", "xDrive20i — N20", "xDrive28i — N20",
          "sDrive18d — N47", "xDrive20d — N47", "xDrive23d — N47",
          "xDrive25d — N47"
        ]},
        { name: "X1 (F48) (2015–2022)", engines: [
          "sDrive18i — B38", "sDrive20i / xDrive20i — B48",
          "xDrive25i — B48", "sDrive18d — B47", "xDrive20d — B47",
          "xDrive25d — B47", "xDrive25e / xDrive30e — plug-in hybrid"
        ]},
        { name: "X1 (U11) (2022–present)", engines: [
          "sDrive18i — 1.5L turbo petrol", "sDrive20i / xDrive20i — 1.5L turbo petrol mild-hybrid",
          "xDrive23i — 2.0L turbo petrol mild-hybrid", "sDrive18d / xDrive20d — 2.0L turbo diesel",
          "xDrive25e — plug-in hybrid", "xDrive30e — plug-in hybrid",
          "iX1 eDrive20 — electric", "iX1 xDrive30 — electric"
        ]}
      ]
    },
    {
      name: "X2",
      models: [
        { name: "X2 (F39) (2018–2023)", engines: [
          "sDrive18i — B38", "sDrive20i / xDrive20i — B48",
          "M35i xDrive — B48", "sDrive18d — B47", "xDrive20d / xDrive25d — B47",
          "xDrive25e — plug-in hybrid"
        ]},
        { name: "X2 (U10) (2023–present)", engines: [
          "sDrive18i — 1.5L turbo petrol (market dependent)", "sDrive20i — 1.5L turbo petrol mild-hybrid",
          "xDrive20i — 2.0L turbo petrol", "M35i xDrive — 2.0L turbo petrol",
          "sDrive18d / xDrive20d — 2.0L turbo diesel",
          "iX2 eDrive20 — electric", "iX2 xDrive30 — electric"
        ]}
      ]
    },
    {
      name: "X3",
      models: [
        { name: "X3 (E83) (2003–2010)", engines: [
          "2.0i — N46", "2.5i — M54", "3.0i — M54", "2.0d — M47",
          "3.0d — M57", "3.0sd — M57 twin-turbo"
        ]},
        { name: "X3 (F25) (2010–2017)", engines: [
          "sDrive18d — N47", "xDrive20i — N20", "xDrive28i — N20",
          "xDrive35i — N55", "xDrive20d — N47", "xDrive30d — N57",
          "xDrive35d — N57", "M40d — B57 (late/selected markets)"
        ]},
        { name: "X3 (G01) (2017–2024)", engines: [
          "sDrive20i / xDrive20i — B48", "xDrive30i — B48",
          "M40i — B58", "X3 M / X3 M Competition — S58",
          "xDrive20d — B47", "xDrive30d — B57", "M40d — B57",
          "xDrive30e — plug-in hybrid"
        ]},
        { name: "X3 (G45) (2024–present)", engines: [
          "20 xDrive — 2.0L turbo petrol mild-hybrid", "30e xDrive — plug-in hybrid",
          "40d xDrive — 3.0L turbo diesel mild-hybrid (market dependent)",
          "M50 xDrive — 3.0L turbo petrol mild-hybrid",
          "Availability and badges vary by market and model year"
        ]}
      ]
    },
    {
      name: "X4",
      models: [
        { name: "X4 (F26) (2014–2018)", engines: [
          "xDrive20i — N20", "xDrive28i — N20", "xDrive35i — N55",
          "M40i — N55", "xDrive20d — N47", "xDrive30d / 35d — N57"
        ]},
        { name: "X4 (G02) (2018–2025)", engines: [
          "xDrive20i — B48", "xDrive30i — B48", "M40i — B58",
          "X4 M / X4 M Competition — S58", "xDrive20d — B47",
          "xDrive30d / M40d — B57"
        ]}
      ]
    },
    {
      name: "X5",
      models: [
        { name: "X5 (E53) (1999–2006)", engines: [
          "3.0i — M54", "4.4i — M62 / N62", "4.6is — M62",
          "4.8is — N62", "3.0d — M57"
        ]},
        { name: "X5 (E70) (2006–2013)", engines: [
          "3.0si — N52", "xDrive35i — N55", "4.8i — N62",
          "xDrive50i — N63", "xDrive30d — M57 / N57", "xDrive40d — N57",
          "M50d — N57", "X5 M — S63"
        ]},
        { name: "X5 (F15) (2013–2018)", engines: [
          "xDrive35i — N55", "xDrive50i — N63", "xDrive25d — N47",
          "xDrive30d — N57", "xDrive40d — N57", "M50d — N57",
          "xDrive40e — plug-in hybrid"
        ]},
        { name: "X5 (G05) (2018–present)", engines: [
          "xDrive40i — B58", "xDrive50i / M50i — N63 (earlier versions)",
          "M60i xDrive — S68 V8 mild-hybrid", "xDrive30d / xDrive40d — B57",
          "M50d — B57 (selected earlier markets)", "xDrive45e / xDrive50e — plug-in hybrid",
          "X5 M / X5 M Competition — S63 (earlier), S68 (latest)"
        ]}
      ]
    },
    {
      name: "X6",
      models: [
        { name: "X6 (E71) (2008–2014)", engines: [
          "xDrive35i — N54 / N55", "xDrive50i — N63", "ActiveHybrid X6 — N63 hybrid",
          "xDrive30d / 35d — M57", "M — S63"
        ]},
        { name: "X6 (F16) (2014–2019)", engines: [
          "xDrive35i — N55", "xDrive50i — N63", "M — S63",
          "xDrive30d / 40d — N57", "M50d — N57"
        ]},
        { name: "X6 (G06) (2019–present)", engines: [
          "xDrive40i — B58", "M50i — N63", "M60i xDrive — S68",
          "xDrive30d / 40d — B57", "M50d — B57 (earlier markets)",
          "X6 M / X6 M Competition — S63 / S68 by model year"
        ]}
      ]
    },
    {
      name: "X7",
      models: [
        { name: "X7 (G07) (2019–present)", engines: [
          "xDrive40i — B58", "xDrive50i — N63 (earlier markets)",
          "M60i xDrive — S68 V8 mild-hybrid", "ALPINA XB7 — tuned N63 / S68 by year",
          "xDrive30d / xDrive40d — B57", "xDrive40i mild-hybrid — market dependent"
        ]}
      ]
    },
    {
      name: "XM",
      models: [
        { name: "BMW XM (G09) (2022–present)", engines: [
          "XM Label — S68 4.4L V8 plug-in hybrid", "XM 50e — 3.0L inline-six plug-in hybrid",
          "XM (standard) — S68 V8 plug-in hybrid"
        ]}
      ]
    },
    {
      name: "i Series (Electric)",
      models: [
        { name: "BMW i3 (I01) (2013–2022)", engines: [
          "i3 60 Ah — electric", "i3 94 Ah — electric", "i3 120 Ah — electric",
          "i3s — electric", "Range Extender (REx) — electric with petrol generator"
        ]},
        { name: "BMW i4 (G26) (2021–present)", engines: [
          "i4 eDrive35 — electric", "i4 eDrive40 — electric",
          "i4 xDrive40 — electric", "i4 M50 xDrive — electric",
          "i4 M60 xDrive — electric (model-year/market dependent)"
        ]},
        { name: "BMW i5 (G60/G61) (2023–present)", engines: [
          "i5 eDrive40 — electric", "i5 xDrive40 — electric",
          "i5 M60 xDrive — electric", "i5 M60 xDrive Touring — electric"
        ]},
        { name: "BMW i7 (G70) (2022–present)", engines: [
          "i7 eDrive50 — electric", "i7 xDrive60 — electric",
          "i7 M70 xDrive — electric"
        ]},
        { name: "BMW i8 (I12/I15) (2014–2020)", engines: [
          "i8 Coupe — 1.5L turbo petrol plug-in hybrid", "i8 Roadster — 1.5L turbo petrol plug-in hybrid"
        ]},
        { name: "BMW iX (I20) (2021–present)", engines: [
          "iX xDrive40 — electric", "iX xDrive45 — electric",
          "iX xDrive50 — electric", "iX xDrive60 — electric",
          "iX M60 — electric", "iX M70 xDrive — electric"
        ]},
        { name: "BMW iX3 (G08) (2020–present)", engines: [
          "iX3 — electric (first generation)", "New-generation iX3 / Neue Klasse — electric (market launch and specification vary)"
        ]}
      ]
    },
    {
      name: "M Models",
      models: [
        { name: "BMW M2", engines: [
          "M2 (F87) — N55", "M2 Competition (F87) — S55",
          "M2 CS (F87) — S55", "M2 (G87) — S58", "M2 CS (G87) — S58 (selected model years)"
        ]},
        { name: "BMW M3", engines: [
          "M3 (E30) — S14", "M3 (E36) — S50 / S52", "M3 (E46) — S54",
          "M3 (E90/E92/E93) — S65", "M3 (F80) — S55",
          "M3 (G80/G81) — S58", "M3 Competition / CS / Touring — S58 variants"
        ]},
        { name: "BMW M4", engines: [
          "M4 (F82/F83) — S55", "M4 Competition — S55",
          "M4 CS / GTS — S55", "M4 (G82/G83) — S58",
          "M4 Competition / CSL / CS — S58 variants"
        ]},
        { name: "BMW M5", engines: [
          "M5 (E28) — M88 / S38", "M5 (E34) — S38", "M5 (E39) — S62",
          "M5 (E60/E61) — S85", "M5 (F10) — S63", "M5 (F90) — S63",
          "M5 (G90/G99) — S68 V8 plug-in hybrid"
        ]},
        { name: "BMW M6", engines: [
          "M6 (E24) — M88 / S38", "M6 (E63/E64) — S85",
          "M6 (F06/F12/F13) — S63"
        ]},
        { name: "BMW M8", engines: [
          "M8 Coupe / Convertible / Gran Coupe (F91/F92/F93) — S63",
          "M8 Competition — S63"
        ]},
        { name: "BMW M Performance (selected)", engines: [
          "M135 / M135i — B48", "M140i — B58", "M235i / M235i xDrive — N55 / B48",
          "M240i — B58", "M340i — B58", "M340d — B57",
          "M440i — B58", "M550i — N63", "M760e — plug-in hybrid",
          "X1 M35i — B48", "X2 M35i — B48", "X3 M40i / M50 — B58",
          "X4 M40i — B58", "X5 M60i — S68", "X6 M60i — S68", "X7 M60i — S68"
        ]}
      ]
    }
  ]
};

export const CAR_BRANDS = Object.keys(VEHICLE_DATA);
