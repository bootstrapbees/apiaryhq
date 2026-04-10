  // Syrup Mixing Guide — researched ratios (Dadant + standard beekeeping references)
  html += secHeader('lib-sec-syrup', '&#127802; Syrup Mixing Guide');
  var SYRUP_DATA = [
    {
      name: '1:1 Sugar Syrup (Spring / Stimulation)',
      ratio: '1 cup sugar : 1 cup water',
      use: 'Stimulates brood rearing and comb building. Mimics a light nectar flow. Use in spring for buildup, new packages, splits, and nucs. Stop feeding when a strong nectar flow begins to prevent syrup from contaminating honey supers.',
      temp: 'Feed when temps are consistently above 50\u00b0F.',
      note: 'Per Dadant: For 1 gallon, use 10\u2154 cups sugar to 10\u2154 cups water. Heat gently until dissolved \u2014 do not boil. Add Honey-B-Healthy (1 tsp/qt) to stimulate feeding. Ratios are equal parts by volume OR weight \u2014 cups to cups, or pounds to pounds.'
    },
    {
      name: '2:1 Sugar Syrup (Fall / Winter Stores)',
      ratio: '2 cups sugar : 1 cup water',
      use: 'Builds winter stores. Heavier syrup is easier for bees to process and cap quickly before cold sets in. Feed after the last honey harvest in fall. Stop when bees stop taking it or temps drop below 50\u00b0F consistently.',
      temp: 'Feed before temps drop consistently below 50\u00b0F.',
      note: 'Ratios are by weight or volume \u2014 2 cups sugar to 1 cup water, or 2 lbs sugar to 1 lb water. Stir into warm water until fully dissolved. Do not boil \u2014 boiling creates HMF compounds harmful to bees. Add Honey-B-Healthy to slow fermentation.'
    },
    {
      name: 'No-Cook Candy Board (Winter Emergency)',
      ratio: '10 lbs sugar : 2 cups water',
      use: 'Emergency winter feed when temps are too cold for liquid syrup. Bees consume it as needed directly above the cluster. Also helps absorb excess hive moisture. Place candy-side down directly above the top bars, replacing the inner cover.',
      temp: 'Use when temps are consistently below 50\u00b0F and syrup feeding is no longer practical.',
      note: 'Mix sugar with just enough water to clump \u2014 start with 2 cups per 10 lbs, add sparingly. Optional: add 1 tsp white vinegar (mold inhibitor) and 1 tsp Honey-B-Healthy. Press firmly into a candy board frame lined with tissue paper. Allow 24 hours to dry and harden before placing on hive.'
    },
    {
      name: 'Cooked Fondant / Sugar Candy',
      ratio: '5 lbs sugar : 1\u2153 cups water',
      use: 'Cooked alternative to the no-cook candy board. Harder set, longer lasting. Can be poured into molds or a candy board frame. Bees eat through it as needed in cold weather when cluster is nearby.',
      temp: 'Use in winter when liquid feeding is not possible.',
      note: 'Combine sugar and water in a heavy pot. Bring to a boil stirring constantly, then stop stirring and cook to 234\u2013248\u00b0F (soft to firm ball stage). Remove from heat, cool to around 200\u00b0F, then beat or pour into molds. Overheating above 250\u00b0F creates HMF \u2014 use a candy thermometer. Optional: add Honey-B-Healthy after removing from heat.'
    }
  ];