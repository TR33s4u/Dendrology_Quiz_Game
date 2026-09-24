/* ============================================================================
   DENDROLOGY QUIZ ENGINE (js/app.js)
   Full implementation: Modes, Input Styles, Typing, Keybinds, Draggable Resizer
============================================================================ */

let SPECIES = [];
let SPECIES_FAMILY = [];
let COMMON_TO_SCI = {};
let SCI_TO_COMMON = {};

const FAMILIES = [
  { num: 1, name: "Adoxaceae", count: 3 }, { num: 2, name: "Altingiaceae", count: 1 },
  { num: 3, name: "Anacardiaceae", count: 4 }, { num: 4, name: "Annonaceae", count: 1 },
  { num: 5, name: "Apocynaceae", count: 1 }, { num: 6, name: "Aquifoliaceae", count: 3 },
  { num: 7, name: "Araliaceae", count: 3 }, { num: 8, name: "Berberidaceae", count: 1 },
  { num: 9, name: "Betulaceae", count: 11 }, { num: 10, name: "Bignoniaceae", count: 1 },
  { num: 11, name: "Caesalpiniaceae", count: 3 }, { num: 12, name: "Cannabaceae", count: 1 },
  { num: 13, name: "Caprifoliaceae", count: 2 }, { num: 14, name: "Celastraceae", count: 2 },
  { num: 15, name: "Cornaceae", count: 5 }, { num: 16, name: "Cupressaceae", count: 4 },
  { num: 17, name: "Ebenaceae", count: 1 }, { num: 18, name: "Ericaceae", count: 9 },
  { num: 19, name: "Fabaceae", count: 5 }, { num: 20, name: "Fagaceae", count: 17 },
  { num: 21, name: "Ginkgoaceae", count: 1 }, { num: 22, name: "Hamamelidaceae", count: 1 },
  { num: 23, name: "Juglandaceae", count: 7 }, { num: 24, name: "Lauraceae", count: 2 },
  { num: 25, name: "Lythraceae", count: 1 }, { num: 26, name: "Magnoliaceae", count: 4 },
  { num: 27, name: "Mimosaceae", count: 1 }, { num: 28, name: "Moraceae", count: 2 },
  { num: 29, name: "Nyssaceae", count: 1 }, { num: 30, name: "Oleaceae", count: 3 },
  { num: 32, name: "Paulowniaceae", count: 1 }, { num: 33, name: "Pinaceae", count: 16 },
  { num: 34, name: "Platanaceae", count: 1 }, { num: 35, name: "Rosaceae", count: 14 },
  { num: 36, name: "Salicaceae", count: 7 }, { num: 37, name: "Sapindaceae", count: 10 },
  { num: 38, name: "Simaroubaceae", count: 1 }, { num: 39, name: "Taxaceae", count: 1 },
  { num: 40, name: "Tiliaceae", count: 2 }, { num: 41, name: "Ulmaceae", count: 3 },
  { num: 42, name: "Vitaceae", count: 2 }, { num: 43, name: "Grossulariaceae", count: 1 },
  { num: 44, name: "Myricaceae", count: 1 }, { num: 45, name: "Hydrangeaceae", count: 1 },
  { num: 46, name: "Smilacaceae", count: 1 }, { num: 47, name: "Staphyleaceae", count: 1 },
  { num: 48, name: "Thymelaeaceae", count: 1 }, { num: 49, name: "Elaeagnaceae", count: 1 },
  { num: 50, name: "Polygonaceae", count: 1 }
];

const QUIZ_TEST_1_SCI = ["asimina triloba","ilex opaca","robinia pseudoacacia","juglans nigra","sassafras albidum","lindera benzoin","liriodendron tulipifera","fraxinus americana","paulownia tomentosa","pinus strobus","tsuga canadensis","platanus occidentalis","acer saccharum","acer negundo","aesculus flava","parthenocissus quinquefolia","toxicodendron radicans","carpinus caroliniana","elaeagnus umbellate","Reynoutria japonica"];
const QUIZ_TEST_2_SCI = ["Cercis canadensis","Quercus alba","Quercus montana","Quercus coccinea","Quercus marilandica","Prunus serotina","Pyrus calleryana","Acer platanoides","Ailanthus altissima","Tilia americana"];
const QUIZ_TEST_3_SCI = ["Quercus rubra","Magnolia acuminata","Acer pensylvanicum","Cornus florida","Acer rubrum","Quercus velutina","Smilax spp.","Carya cordiformis","Berbis spp."];
const QUIZ_TEST_4_SCI = ["Nyssa sylvatica","Fagus grandifolia","Pinus rigida","Pinus virginiana","Oxydendrum arboreum","Quercus falcata","Juniperus virginiana","Albizia julibrissin","Quercus stellata","Diospyros virginiana"];
const QUIZ_TEST_5_SCI = ["Malus pumila","Pinus taeda","Quercus phellos","Hedera helix","Catalpa speciosa","Cornus kousa","Carya glabra var.glabra","Fraxinus pennsylvanica","Rubus phoenicolasius","Ulmus rubra","Rosa multiflora","Cupressocyparis leylandii","Acer saccharinum"];

const SPECIES_INFO = {
  'abies balsamea': { form: 'tree', leaf: 'evergreen', zones: '3–5', range: 'NE. U.S. & Canada', notes: 'balsam fir', invasive: false },
  'acer negundo': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'most of U.S. & S. Canada', notes: 'boxelder', invasive: false },
  'acer nigrum': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'NE. & C. U.S.', notes: 'black maple', invasive: false },
  'acer palmatum': { form: 'tree / shrub', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'Japanese maple', invasive: false },
  'acer pensylvanicum': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & Appalachians', notes: 'striped bark', invasive: false },
  'acer platanoides': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'Europe (invasive in NE. U.S.)', notes: 'Norway maple', invasive: true },
  'acer rubrum': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'red maple', invasive: false },
  'acer saccharinum': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'silver maple', invasive: false },
  'acer saccharum': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'sugar maple', invasive: false },
  'aesculus flava': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'Appalachians & Ohio Valley', notes: 'yellow buckeye', invasive: false },
  'aesculus hippocastanum': { form: 'tree', leaf: 'deciduous', zones: '4–7', range: 'Balkans (planted)', notes: 'horse chestnut', invasive: false },
  'ailanthus altissima': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'China (invasive)', notes: 'tree-of-heaven', invasive: true },
  'albizia julibrissin': { form: 'tree', leaf: 'deciduous', zones: '6–9', range: 'Asia (naturalized)', notes: 'mimosa', invasive: true },
  'alnus serrulata': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S. wetlands', notes: 'brookside alder', invasive: false },
  'amelanchier arborea': { form: 'tree / shrub', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'serviceberry', invasive: false },
  'aralia spinosa': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'Hercules-club', invasive: false },
  'asimina triloba': { form: 'tree / shrub', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'pawpaw', invasive: false },
  'berbis spp.': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'Eurasian', notes: 'barberry', invasive: true },
  'betula alleghaniensis': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & E. Canada', notes: 'yellow birch', invasive: false },
  'betula lenta': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'Appalachians & NE. U.S.', notes: 'black birch', invasive: false },
  'betula nigra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S. floodplains', notes: 'river birch', invasive: false },
  'betula papyrifera': { form: 'tree', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'paper birch', invasive: false },
  'betula pendula': { form: 'tree', leaf: 'deciduous', zones: '2–7', range: 'Europe & Asia (planted)', notes: 'European white birch', invasive: false },
  'betula populifolia': { form: 'tree', leaf: 'deciduous', zones: '3–6', range: 'NE. U.S. & SE. Canada', notes: 'gray birch', invasive: false },
  'carpinus caroliniana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'musclewood', invasive: false },
  'carya cordiformis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'bitternut hickory', invasive: false },
  'carya glabra var.glabra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'pignut hickory', invasive: false },
  'carya ovalis': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. U.S.', notes: 'red hickory', invasive: false },
  'carya ovata': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. North America', notes: 'shagbark hickory', invasive: false },
  'carya tomentosa': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'mockernut hickory', invasive: false },
  'castanea dentata': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. U.S.', notes: 'American chestnut', invasive: false },
  'castanea pumila': { form: 'shrub / small tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'Allegheny chinkapin', invasive: false },
  'catalpa speciosa': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'C. U.S.', notes: 'northern catalpa', invasive: false },
  'celastrus orbiculatus': { form: 'vine', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive E. U.S.)', notes: 'oriental bittersweet', invasive: true },
  'celtis occidentalis': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'E. & C. North America', notes: 'hackberry', invasive: false },
  'cercis canadensis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'eastern redbud', invasive: false },
  'chimaphila maculata': { form: 'groundcover', leaf: 'evergreen', zones: '4–7', range: 'E. North America forests', notes: 'striped pipsissewa', invasive: false },
  'chionanthus virginicus': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'fringe tree', invasive: false },
  'cladrastis lutea': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'SE. U.S.', notes: 'yellow wood', invasive: false },
  'comptonia peregrina': { form: 'shrub', leaf: 'deciduous', zones: '2–6', range: 'E. North America', notes: 'sweet fern', invasive: false },
  'cornus alternifolia': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–7', range: 'E. North America', notes: 'alternate-leaf dogwood', invasive: false },
  'cornus florida': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'flowering dogwood', invasive: false },
  'cornus kousa': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'kousa dogwood', invasive: false },
  'cornus obliqua': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'E. North America wetlands', notes: 'silky dogwood', invasive: false },
  'cornus stolonifera': { form: 'shrub', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'red-osier dogwood', invasive: false },
  'corylus americana': { form: 'shrub', leaf: 'deciduous', zones: '4–9', range: 'E. & C. North America', notes: 'American hazelnut', invasive: false },
  'corylus cornuta': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'N. North America', notes: 'beaked hazel', invasive: false },
  'crataegus spp.': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–8', range: 'N. Hemisphere', notes: 'hawthorn', invasive: false },
  'cupressocyparis leylandii': { form: 'tree', leaf: 'evergreen', zones: '6–10', range: 'hybrid (planted)', notes: 'Leyland cypress', invasive: false },
  'diospyros virginiana': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'common persimmon', invasive: false },
  'dirca palustris': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'leatherwood', invasive: false },
  'elaeagnus umbellate': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'Asia (invasive)', notes: 'autumn-olive', invasive: true },
  'euonymus americana': { form: 'shrub', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'strawberry bush', invasive: false },
  'fagus grandifolia': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'American beech', invasive: false },
  'fraxinus americana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'white ash', invasive: false },
  'fraxinus pennsylvanica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. North America', notes: 'green ash', invasive: false },
  'gaultheria procumbens': { form: 'groundcover', leaf: 'evergreen', zones: '3–8', range: 'E. North America', notes: 'teaberry', invasive: false },
  'gaylussacia spp.': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'huckleberry', invasive: false },
  'ginkgo biloba': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'China (planted)', notes: 'ginkgo', invasive: false },
  'gleditsia triacanthos': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'C. U.S.', notes: 'honeylocust', invasive: false },
  'gleditsia triacanthos(var. inermis)': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'cultivar', notes: 'thornless honeylocust', invasive: false },
  'gymnocladus dioicus': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. U.S.', notes: 'Kentucky coffee tree', invasive: false },
  'hamamelis virginiana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'witch-hazel', invasive: false },
  'hedera helix': { form: 'vine', leaf: 'evergreen', zones: '5–11', range: 'Europe', notes: 'English ivy', invasive: true },
  'hydrangea arborescens': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'wild hydrangea', invasive: false },
  'ilex montana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '5–7', range: 'Appalachians', notes: 'mountain holly', invasive: false },
  'ilex opaca': { form: 'tree', leaf: 'evergreen', zones: '5–9', range: 'E. U.S.', notes: 'American holly', invasive: false },
  'ilex verticillata': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'winterberry holly', invasive: false },
  'juglans cinerea': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & SE. Canada', notes: 'butternut', invasive: false },
  'juglans nigra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. & C. U.S.', notes: 'black walnut', invasive: false },
  'juniperus virginiana': { form: 'tree', leaf: 'evergreen', zones: '2–9', range: 'E. & C. U.S.', notes: 'eastern redcedar', invasive: false },
  'kalmia latifolia': { form: 'shrub', leaf: 'evergreen', zones: '4–9', range: 'E. U.S.', notes: 'mountain-laurel', invasive: false },
  'lagerstroemia indica': { form: 'tree / shrub', leaf: 'deciduous', zones: '7–9', range: 'Asia (planted)', notes: 'crape myrtle', invasive: false },
  'larix spp.': { form: 'tree', leaf: 'deciduous conifer', zones: '2–5', range: 'N. Hemisphere', notes: 'larch', invasive: false },
  'lindera benzoin': { form: 'shrub', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'spicebush', invasive: false },
  'liquidambar styraciflua': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'sweetgum', invasive: false },
  'liriodendron tulipifera': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'yellow-poplar', invasive: false },
  'lonicera japonica': { form: 'vine', leaf: 'semi-evergreen', zones: '4–9', range: 'Asia', notes: 'Japanese honeysuckle', invasive: true },
  'maclura pomifera': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'S.-C. U.S.', notes: 'osage-orange', invasive: false },
  'magnolia acuminata': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'E. U.S.', notes: 'cucumbertree', invasive: false },
  'magnolia fraseri': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'S. Appalachians', notes: 'Fraser magnolia', invasive: false },
  'magnolia grandiflora': { form: 'tree', leaf: 'evergreen', zones: '7–9', range: 'SE. U.S.', notes: 'southern magnolia', invasive: false },
  'malus pumila': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. Asia (planted)', notes: 'common apple', invasive: false },
  'morus rubra': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. U.S.', notes: 'red mulberry', invasive: false },
  'nyssa sylvatica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'blackgum', invasive: false },
  'ostrya virginiana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'ironwood', invasive: false },
  'oxydendrum arboreum': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'sourwood', invasive: false },
  'panax quinquefolius': { form: 'herb', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'ginseng', invasive: false },
  'parthenocissus quinquefolia': { form: 'vine', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'Virginia creeper', invasive: false },
  'paulownia tomentosa': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'China (naturalized)', notes: 'royal paulownia', invasive: true },
  'picea abies': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Europe (planted)', notes: 'Norway spruce', invasive: false },
  'picea glauca': { form: 'tree', leaf: 'evergreen', zones: '2–6', range: 'N. North America', notes: 'white spruce', invasive: false },
  'picea pungens': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Rocky Mountains', notes: 'blue spruce', invasive: false },
  'picea rubens': { form: 'tree', leaf: 'evergreen', zones: '2–5', range: 'NE. U.S. & Appalachians', notes: 'red spruce', invasive: false },
  'pieris floribunda': { form: 'shrub', leaf: 'evergreen', zones: '4–6', range: 'S. Appalachians', notes: 'mountain fetterbush', invasive: false },
  'pinus echinata': { form: 'tree', leaf: 'evergreen', zones: '6–9', range: 'SE. U.S.', notes: 'shortleaf pine', invasive: false },
  'pinus palustris': { form: 'tree', leaf: 'evergreen', zones: '7–9', range: 'SE. U.S.', notes: 'longleaf pine', invasive: false },
  'pinus pungens': { form: 'tree', leaf: 'evergreen', zones: '5–7', range: 'Appalachians', notes: 'Table Mountain pine', invasive: false },
  'pinus resinosa': { form: 'tree', leaf: 'evergreen', zones: '2–5', range: 'NE. U.S. & Canada', notes: 'red pine', invasive: false },
  'pinus rigida': { form: 'tree', leaf: 'evergreen', zones: '4–7', range: 'NE. U.S. & Appalachians', notes: 'pitch pine', invasive: false },
  'pinus strobus': { form: 'tree', leaf: 'evergreen', zones: '3–8', range: 'NE. U.S. & Canada', notes: 'eastern white pine', invasive: false },
  'pinus sylvestris': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Europe & Asia', notes: 'scotch pine', invasive: false },
  'pinus taeda': { form: 'tree', leaf: 'evergreen', zones: '6–9', range: 'SE. U.S.', notes: 'loblolly pine', invasive: false },
  'pinus virginiana': { form: 'tree', leaf: 'evergreen', zones: '4–8', range: 'E. U.S.', notes: 'Virginia pine', invasive: false },
  'platanus occidentalis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'American sycamore', invasive: false },
  'populus alba': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'Europe (planted)', notes: 'white poplar', invasive: true },
  'populus balsamifera': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'N. North America', notes: 'balsam poplar', invasive: false },
  'populus grandidentata': { form: 'tree', leaf: 'deciduous', zones: '3–5', range: 'NE. U.S. & Canada', notes: 'bigtooth aspen', invasive: false },
  'populus nigra var. italica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'cultivar', notes: 'Lombardy poplar', invasive: false },
  'populus tremuloides': { form: 'tree', leaf: 'deciduous', zones: '1–6', range: 'N. North America', notes: 'quaking aspen', invasive: false },
  'prunus avium': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'Europe (planted)', notes: 'sweet cherry', invasive: false },
  'prunus pendula': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'Japan (planted)', notes: 'weeping cherry', invasive: false },
  'prunus pensylvanica': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'N. North America', notes: 'fire cherry', invasive: false },
  'prunus serotina': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'black cherry', invasive: false },
  'prunus virginiana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'chokecherry', invasive: false },
  'pueraria montana': { form: 'vine', leaf: 'deciduous', zones: '5–10', range: 'Asia (invasive)', notes: 'kudzu', invasive: true },
  'pyrus calleryana': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'China (invasive)', notes: 'Bradford pear', invasive: true },
  'quercus acutissima': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. Asia (planted)', notes: 'sawtooth oak', invasive: false },
  'quercus alba': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'white oak', invasive: false },
  'quercus coccinea': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'scarlet oak', invasive: false },
  'quercus falcata': { form: 'tree', leaf: 'deciduous', zones: '6–9', range: 'SE. U.S.', notes: 'southern red oak', invasive: false },
  'quercus ilicifolia': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–7', range: 'NE. U.S.', notes: 'bear oak', invasive: false },
  'quercus macrocarpa': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. North America', notes: 'bur oak', invasive: false },
  'quercus marilandica': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. & C. U.S.', notes: 'blackjack oak', invasive: false },
  'quercus michauxii': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'swamp chestnut oak', invasive: false },
  'quercus montana': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'Appalachians', notes: 'chestnut oak', invasive: false },
  'quercus palustris': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. & C. U.S.', notes: 'pin oak', invasive: false },
  'quercus phellos': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'willow oak', invasive: false },
  'quercus rubra': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'E. North America', notes: 'northern red oak', invasive: false },
  'quercus stellata': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. & C. U.S.', notes: 'post oak', invasive: false },
  'quercus velutina': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'black oak', invasive: false },
  'reynoutria japonica': { form: 'herbaceous shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive)', notes: 'Japanese knotweed', invasive: true },
  'rhododendron maximum': { form: 'shrub', leaf: 'evergreen', zones: '3–7', range: 'Appalachians', notes: 'rosebay rhododendron', invasive: false },
  'rhododendron spp.': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'E. North America', notes: 'wild azalea', invasive: false },
  'rhus copallina': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'winged sumac', invasive: false },
  'rhus glabra': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–9', range: 'most of U.S.', notes: 'smooth sumac', invasive: false },
  'rhus typhina': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'staghorn sumac', invasive: false },
  'ribes spp.': { form: 'shrub', leaf: 'deciduous', zones: '3–7', range: 'North America', notes: 'gooseberry', invasive: false },
  'robinia pseudoacacia': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'Appalachians', notes: 'black locust', invasive: false },
  'rosa multiflora': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive)', notes: 'multiflora rose', invasive: true },
  'rubus allegheniensis': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'blackberry', invasive: false },
  'rubus occidentalis': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'black raspberry', invasive: false },
  'rubus phoenicolasius': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (naturalized)', notes: 'wine raspberry', invasive: true },
  'salix babylonica': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'China (planted)', notes: 'weeping willow', invasive: false },
  'salix nigra': { form: 'tree', leaf: 'deciduous', zones: '2–8', range: 'E. North America', notes: 'black willow', invasive: false },
  'sambucus canadensis': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'common elderberry', invasive: false },
  'sassafras albidum': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'sassafras', invasive: false },
  'smilax spp.': { form: 'vine', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'greenbrier', invasive: false },
  'sorbus americana': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'NE. U.S. & Canada', notes: 'mountain-ash', invasive: false },
  'staphylea trifolia': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'bladdernut', invasive: false },
  'symphoricarpos orbiculatus': { form: 'shrub', leaf: 'deciduous', zones: '2–8', range: 'E. & C. U.S.', notes: 'coralberry', invasive: false },
  'taxodium distichum var. distichum': { form: 'tree', leaf: 'deciduous conifer', zones: '4–10', range: 'SE. U.S.', notes: 'baldcypress', invasive: false },
  'taxus spp.': { form: 'shrub / tree', leaf: 'evergreen', zones: '4–7', range: 'N. Hemisphere', notes: 'yew', invasive: false },
  'thuja occidentalis': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'NE. U.S. & Canada', notes: 'northern white-cedar', invasive: false },
  'tilia americana': { form: 'tree', leaf: 'deciduous', zones: '2–8', range: 'E. North America', notes: 'American basswood', invasive: false },
  'tilia cordata': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'Europe (planted)', notes: 'littleleaf linden', invasive: false },
  'toxicodendron radicans': { form: 'vine / shrub', leaf: 'deciduous', zones: '3–10', range: 'E. & C. North America', notes: 'poison-ivy', invasive: false },
  'tsuga canadensis': { form: 'tree', leaf: 'evergreen', zones: '3–7', range: 'E. North America', notes: 'eastern hemlock', invasive: false },
  'ulmus americana': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'E. North America', notes: 'American elm', invasive: false },
  'ulmus rubra': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. U.S.', notes: 'slippery elm', invasive: false },
  'vaccinium spp.': { form: 'shrub', leaf: 'deciduous', zones: '2–8', range: 'E. North America', notes: 'blueberry', invasive: false },
  'viburnum acerifolium': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'mapleleaf viburnum', invasive: false },
  'viburnum prunifolium': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. North America', notes: 'blackhaw viburnum', invasive: false },
  'vinca minor': { form: 'groundcover vine', leaf: 'evergreen', zones: '4–9', range: 'Europe (naturalized)', notes: 'periwinkle', invasive: true },
  'vitis spp.': { form: 'vine', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'wild grape', invasive: false },
  'wisteria spp.': { form: 'vine', leaf: 'deciduous', zones: '5–9', range: 'Asia / native', notes: 'wisteria', invasive: true },
  'zelkova serrata': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'Japanese zelkova', invasive: false }
};

const PRON = {
  "abies balsamea": "AY-beez bal-SAY-mee-uh", "acer negundo": "AY-ser neh-GUN-doh",
  "acer nigrum": "AY-ser NY-grum", "acer palmatum": "AY-ser pal-MAY-tum",
  "acer pensylvanicum": "AY-ser pen-sil-VAN-ih-kum", "acer platanoides": "AY-ser plat-uh-NOY-deez",
  "acer rubrum": "AY-ser ROO-brum", "acer saccharinum": "AY-ser sak-uh-RY-num",
  "acer saccharum": "AY-ser SAK-uh-rum", "aesculus flava": "ESS-kyoo-lus FLAY-vuh",
  "aesculus hippocastanum": "ESS-kyoo-lus hip-oh-KAS-tuh-num", "ailanthus altissima": "ay-LAN-thus al-TISS-ih-muh",
  "albizia julibrissin": "al-BIZ-ee-uh joo-lih-BRISS-in", "alnus serrulata": "AL-nus sair-yoo-LAY-tuh",
  "amelanchier arborea": "am-uh-LAN-kee-er ar-BOR-ee-uh", "aralia spinosa": "uh-RAY-lee-uh spy-NOH-suh",
  "asimina triloba": "uh-SIM-ih-nuh try-LOH-buh", "berbis spp.": "BER-ber-iss species",
  "betula alleghaniensis": "BET-yoo-luh al-eh-gay-nee-EN-sis", "betula lenta": "BET-yoo-luh LEN-tuh",
  "betula nigra": "BET-yoo-luh NY-gruh", "betula papyrifera": "BET-yoo-luh pap-ih-RIF-er-uh",
  "betula pendula": "BET-yoo-luh PEN-dyoo-luh", "betula populifolia": "BET-yoo-luh pop-yoo-lih-FOH-lee-uh",
  "carpinus caroliniana": "kar-PY-nus kair-oh-lin-ee-AY-nuh", "carya cordiformis": "KAIR-ee-uh kor-dih-FOR-miss",
  "carya glabra var.glabra": "KAIR-ee-uh GLAB-ruh", "carya ovalis": "KAIR-ee-uh oh-VAY-lis",
  "carya ovata": "KAIR-ee-uh oh-VAY-tuh", "carya tomentosa": "KAIR-ee-uh toh-men-TOH-suh",
  "castanea dentata": "kas-TAY-nee-uh den-TAY-tuh", "castanea pumila": "kas-TAY-nee-uh PYOO-mih-luh",
  "catalpa speciosa": "kuh-TAL-puh spee-see-OH-suh", "celastrus orbiculatus": "seh-LASS-trus or-bik-yoo-LAY-tus",
  "celtis occidentalis": "SEL-tiss ok-sih-den-TAL-iss", "cercis canadensis": "SER-sis kan-uh-DEN-sis",
  "chimaphila maculata": "ky-MAF-ih-luh mak-yoo-LAY-tuh", "chionanthus virginicus": "ky-oh-NAN-thus ver-JIN-ih-kus",
  "cladrastis lutea": "klad-RAS-tiss LOO-tee-uh", "comptonia peregrina": "komp-TOH-nee-uh pair-eh-GRY-nuh",
  "cornus alternifolia": "KOR-nus al-ter-nih-FOH-lee-uh", "cornus florida": "KOR-nus FLOR-ih-duh",
  "cornus kousa": "KOR-nus KOO-suh", "cornus obliqua": "KOR-nus oh-BLEE-kwuh",
  "cornus stolonifera": "KOR-nus stoh-lon-IF-er-uh", "corylus americana": "KOR-ih-lus uh-mair-ih-KAN-uh",
  "corylus cornuta": "KOR-ih-lus kor-NOO-tuh", "crataegus spp.": "kruh-TEE-gus species",
  "cupressocyparis leylandii": "koo-press-oh-SIP-uh-riss lay-LAN-dee-eye", "diospyros virginiana": "dy-OSS-pih-ros ver-jin-ee-AY-nuh",
  "dirca palustris": "DIR-kuh puh-LUS-triss", "elaeagnus umbellate": "el-ee-AG-nus um-bel-LAY-tee",
  "euonymus americana": "yoo-ON-ih-mus uh-mair-ih-KAN-uh", "fagus grandifolia": "FAY-gus gran-dih-FOH-lee-uh",
  "fraxinus americana": "FRAK-sih-nus uh-mair-ih-KAN-uh", "fraxinus pennsylvanica": "FRAK-sih-nus pen-sil-VAN-ih-kuh",
  "gaultheria procumbens": "gaul-THEER-ee-uh proh-KUM-benz", "gaylussacia spp.": "gay-loo-SAY-shuh species",
  "ginkgo biloba": "GINK-go by-LOH-buh", "gleditsia triacanthos": "gleh-DIT-see-uh try-uh-KAN-thos",
  "gleditsia triacanthos(var. inermis)": "gleh-DIT-see-uh try-uh-KAN-thos variety in-ER-mis", "gymnocladus dioicus": "jim-noh-CLAY-dus dy-OY-kus",
  "hamamelis virginiana": "ham-uh-MEE-lis ver-jin-ee-AY-nuh", "hedera helix": "HED-er-uh HEE-liks",
  "hydrangea arborescens": "hy-DRAN-juh ar-boh-RESS-enz", "ilex montana": "EYE-leks mon-TAN-uh",
  "ilex opaca": "EYE-leks oh-PAY-kuh", "ilex verticillata": "EYE-leks ver-tiss-ih-LAY-tuh",
  "juglans cinerea": "JOO-glanz sih-NEER-ee-uh", "juglans nigra": "JOO-glanz NY-gruh",
  "juniperus virginiana": "joo-NIP-er-us ver-jin-ee-AY-nuh", "kalmia latifolia": "KAL-mee-uh lat-ih-FOH-lee-uh",
  "lagerstroemia indica": "lay-ger-STROH-mee-uh IN-dih-kuh", "larix spp.": "LAIR-iks species",
  "lindera benzoin": "LIN-der-uh BEN-zoh-in", "liquidambar styraciflua": "lik-wid-AM-bar sty-ruh-SIF-loo-uh",
  "liriodendron tulipifera": "leer-ee-oh-DEN-dron too-lih-PIF-er-uh", "lonicera japonica": "loh-NISS-er-uh juh-PON-ih-kuh",
  "maclura pomifera": "muh-CLURE-uh poh-MIF-er-uh", "magnolia acuminata": "mag-NOH-lee-uh uh-kyoo-mih-NAY-tuh",
  "magnolia fraseri": "mag-NOH-lee-uh FRAY-zer-eye", "magnolia grandiflora": "mag-NOH-lee-uh gran-dih-FLOR-uh",
  "malus pumila": "MAY-lus PYOO-mih-luh", "morus rubra": "MOR-us ROO-bruh",
  "nyssa sylvatica": "NISS-uh sil-VAT-ih-kuh", "ostrya virginiana": "OSS-tree-uh ver-jin-ee-AY-nuh",
  "oxydendrum arboreum": "ox-ih-DEN-drum ar-BOR-ee-um", "panax quinquefolius": "PAY-naks kwin-kweh-FOH-lee-us",
  "parthenocissus quinquefolia": "par-then-oh-SISS-us kwin-kweh-FOH-lee-uh", "paulownia tomentosa": "paw-LOH-nee-uh toh-men-TOH-suh",
  "picea abies": "PY-see-uh AY-beez", "picea glauca": "PY-see-uh GLAW-kuh",
  "picea pungens": "PY-see-uh PUN-jenz", "picea rubens": "PY-see-uh ROO-benz",
  "pieris floribunda": "PY-er-iss flor-ih-BUN-duh", "pinus echinata": "PY-nus ek-ih-NAY-tuh",
  "pinus palustris": "PY-nus puh-LUS-triss", "pinus pungens": "PY-nus PUN-jenz",
  "pinus resinosa": "PY-nus rez-ih-NOH-suh", "pinus rigida": "PY-nus RIJ-ih-duh",
  "pinus strobus": "PY-nus STROH-bus", "pinus sylvestris": "PY-nus sil-VESS-triss",
  "pinus taeda": "PY-nus TEE-duh", "pinus virginiana": "PY-nus ver-jin-ee-AY-nuh",
  "platanus occidentalis": "PLAT-uh-nus ok-sih-den-TAL-iss", "populus alba": "POP-yoo-lus AL-buh",
  "populus balsamifera": "POP-yoo-lus bal-suh-MIF-er-uh", "populus grandidentata": "POP-yoo-lus gran-dih-den-TAY-tuh",
  "populus nigra var. italica": "POP-yoo-lus NY-gruh variety ih-TAL-ih-kuh", "populus tremuloides": "POP-yoo-lus trem-yoo-LOY-deez",
  "prunus avium": "PROO-nus AY-vee-um", "prunus pendula": "PROO-nus PEN-dyoo-luh",
  "prunus pensylvanica": "PROO-nus pen-sil-VAN-ih-kuh", "prunus serotina": "PROO-nus seh-ROT-ih-nuh",
  "prunus virginiana": "PROO-nus ver-jin-ee-AY-nuh", "pueraria montana": "poo-uh-RAIR-ee-uh mon-TAN-uh",
  "pyrus calleryana": "PY-rus kal-eh-ree-AY-nuh", "quercus acutissima": "KWER-kus uh-kyoo-TISS-ih-muh",
  "quercus alba": "KWER-kus AL-buh", "quercus coccinea": "KWER-kus kok-SIN-ee-uh",
  "quercus falcata": "KWER-kus fal-KAY-tuh", "quercus ilicifolia": "KWER-kus il-ih-sih-FOH-lee-uh",
  "quercus macrocarpa": "KWER-kus mak-roh-KAR-puh", "quercus marilandica": "KWER-kus mair-ih-LAN-dih-kuh",
  "quercus michauxii": "KWER-kus mih-SHOH-ee-eye", "quercus montana": "KWER-kus mon-TAN-uh",
  "quercus palustris": "KWER-kus puh-LUS-triss", "quercus phellos": "KWER-kus FEL-os",
  "quercus rubra": "KWER-kus ROO-bruh", "quercus stellata": "KWER-kus steh-LAY-tuh",
  "quercus velutina": "KWER-kus veh-loo-TY-nuh", "reynoutria japonica": "ray-NOO-tree-uh juh-PON-ih-kuh",
  "rhododendron maximum": "roh-doh-DEN-dron MAX-ih-mum", "rhododendron spp.": "roh-doh-DEN-dron species",
  "rhus copallina": "ROOS koh-puh-LY-nuh", "rhus glabra": "ROOS GLAB-ruh",
  "rhus typhina": "ROOS ty-FY-nuh", "ribes spp.": "RY-beez species",
  "robinia pseudoacacia": "roh-BIN-ee-uh soo-doh-uh-KAY-shuh", "rosa multiflora": "ROH-zuh mul-tih-FLOR-uh",
  "rubus allegheniensis": "ROO-bus al-eh-gay-nee-EN-sis", "rubus occidentalis": "ROO-bus ok-sih-den-TAL-iss",
  "rubus phoenicolasius": "ROO-bus fee-nih-koh-LAY-see-us", "salix babylonica": "SAY-liks bab-ih-LON-ih-kuh",
  "salix nigra": "SAY-liks NY-gruh", "sambucus canadensis": "sam-BYOO-kus kan-uh-DEN-sis",
  "sassafras albidum": "SASS-uh-frass AL-bih-dum", "smilax spp.": "SMY-laks species",
  "sorbus americana": "SOR-bus uh-mair-ih-KAN-uh", "staphylea trifolia": "staf-ih-LEE-uh try-FOH-lee-uh",
  "symphoricarpos orbiculatus": "sim-for-ih-KAR-pos or-bik-yoo-LAY-tus", "taxodium distichum var. distichum": "tak-SOH-dee-um DISS-tih-kum",
  "taxus spp.": "TAK-sus species", "thuja occidentalis": "THOO-yuh ok-sih-den-TAL-iss",
  "tilia americana": "TIL-ee-uh uh-mair-ih-KAN-uh", "tilia cordata": "TIL-ee-uh kor-DAY-tuh",
  "toxicodendron radicans": "tok-sih-koh-DEN-dron RAD-ih-kanz", "tsuga canadensis": "SOO-guh kan-uh-DEN-sis",
  "ulmus americana": "UL-mus uh-mair-ih-KAN-uh", "ulmus rubra": "UL-mus ROO-bruh",
  "vaccinium spp.": "vak-SIN-ee-um species", "viburnum acerifolium": "vy-BUR-num ay-ser-ih-FOH-lee-um",
  "viburnum prunifolium": "vy-BUR-num proo-nih-FOH-lee-um", "vinca minor": "VING-kuh MY-nor",
  "vitis spp.": "VY-tiss species", "wisteria spp.": "wiss-TEER-ee-uh species", "zelkova serrata": "zel-KOH-vuh seh-RAY-tuh"
};

const KEYBIND_DEFAULTS = {
  submit: 'Enter', next: 'Enter', space: ' ', cancel: 'Escape',
  hint: 'h', left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown',
  restart: 'r', redoMissed: 'Tab', home: 'Enter'
};
let keybinds = Object.assign({}, KEYBIND_DEFAULTS);
let kbHighlight = -1;
let keybindListening = null;

let TIME_LIMIT = 15;
let TOTAL = 10;
let preferredQuizLength = 10;
let NUM_CHOICES = 4;
let PIC_APPEAR_AT = 5;
let selectedSpecies = [];
let mode = 'sci-to-common';
let selectedModes = ['sci-to-common'];
let selectedStyles = ['quiz'];
let typeAnswerMode = false;
let typeSuggest = true;
let score = 0;
let streak = 0;
let qIndex = 0;
let currentCorrect = '';
let currentPair = null;
let questions = [];
let missed = [];
let isUltimate = false;
let isGuest = false;
let playerName = '';
let timerId = null;
let timeLeft = TIME_LIMIT;
let answered = false;
let hintUsedThisQ = false;
let noPictures = false;

let modeBtns, startScreen, quizScreen, endScreen, stats, promptEl, promptLabel;
let optionsEl, feedback, nextBtn, progressBar, timerBar, timerText, speciesImg;
let imgPlaceholder, imgLoading, imgCredit;

function withPron(name) {
  if (!name) return '';
  const p = PRON[name] || PRON[String(name).toLowerCase()];
  return p ? `${name} (${p})` : name;
}

function familyNameForPair(pair) {
  if (!pair || !pair.length) return '';
  let idx = -1;
  for (let i = 0; i < SPECIES.length; i++) {
    if (SPECIES[i][0] === pair[0] && SPECIES[i][1] === pair[1]) { idx = i; break; }
  }
  if (idx < 0) return '';
  const num = SPECIES_FAMILY[idx];
  const f = FAMILIES.find(item => item.num === num);
  return f ? `${f.num}. ${f.name}` : String(num);
}

function keyLabel(k) {
  if (!k) return '—';
  if (k === ' ') return 'Space';
  if (k === 'ArrowLeft') return '←';
  if (k === 'ArrowRight') return '→';
  if (k === 'ArrowUp') return '↑';
  if (k === 'ArrowDown') return '↓';
  return k.length === 1 ? k.toUpperCase() : k;
}

function initImageResizer() {
  const handle = document.getElementById('imgResizeHandle');
  const wrap = document.getElementById('imageWrap');
  if (!handle || !wrap) return;

  let startY, startH;
  function onPointerDown(e) {
    startY = e.clientY || (e.touches && e.touches[0].clientY);
    startH = wrap.offsetHeight;
    document.documentElement.addEventListener('pointermove', onPointerMove);
    document.documentElement.addEventListener('pointerup', onPointerUp);
    e.preventDefault();
  }
  function onPointerMove(e) {
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const newH = Math.max(50, Math.min(450, startH + (clientY - startY)));
    wrap.style.height = `${newH}px`;
    wrap.style.setProperty('--img-h', `${newH}px`);
  }
  function onPointerUp() {
    document.documentElement.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerup', onPointerUp);
  }
  handle.addEventListener('pointerdown', onPointerDown);
}

function clearKbHighlight() {
  kbHighlight = -1;
  document.querySelectorAll('.option').forEach(o => o.classList.remove('kb-focus'));
}

function setKbHighlight(idx) {
  const opts = Array.from(document.querySelectorAll('.option:not([disabled])'));
  if (!opts.length) return;
  if (idx < 0) idx = opts.length - 1;
  if (idx >= opts.length) idx = 0;
  clearKbHighlight();
  kbHighlight = idx;
  opts[kbHighlight].classList.add('kb-focus');
}

async function loadDataAndInit() {
  try {
    const res = await fetch('./data/species.json');
    const data = await res.json();
    
    SPECIES = [];
    SPECIES_FAMILY = [];
    COMMON_TO_SCI = {};
    SCI_TO_COMMON = {};

    data.forEach(item => {
      SPECIES.push([item.common, item.scientific]);
      SPECIES_FAMILY.push(item.familyNum);
      COMMON_TO_SCI[item.common] = item.scientific;
      SCI_TO_COMMON[item.scientific] = item.common;
    });

    initUISelectors();
    initFamilySelect();
    initSettingsAndPanels();
    initImageResizer();
    renderKeybindList();
    renderLeaderboard();
  } catch (err) {
    console.error("Failed loading species.json:", err);
  }
}

function initUISelectors() {
  modeBtns = document.querySelectorAll('#modeSelect .mode-btn');
  startScreen = document.getElementById('startScreen');
  quizScreen = document.getElementById('quizScreen');
  endScreen = document.getElementById('endScreen');
  stats = document.getElementById('stats');
  promptEl = document.getElementById('prompt');
  promptLabel = document.getElementById('promptLabel');
  optionsEl = document.getElementById('options');
  feedback = document.getElementById('feedback');
  nextBtn = document.getElementById('nextBtn');
  progressBar = document.getElementById('progressBar');
  timerBar = document.getElementById('timerBar');
  timerText = document.getElementById('timerText');
  speciesImg = document.getElementById('speciesImg');
  imgPlaceholder = document.getElementById('imgPlaceholder');
  imgLoading = document.getElementById('imgLoading');
  imgCredit = document.getElementById('imgCredit');
}

function initSettingsAndPanels() {
  document.querySelectorAll('#modeSelect .mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const allModeBtns = document.querySelectorAll('#modeSelect .mode-btn');
      const isCurrentlyActive = btn.classList.contains('active');
      const activeCount = document.querySelectorAll('#modeSelect .mode-btn.active').length;

      if (isCurrentlyActive && activeCount <= 1) return;

      btn.classList.toggle('active');

      selectedModes = [];
      allModeBtns.forEach(b => {
        if (b.classList.contains('active')) selectedModes.push(b.dataset.mode);
      });
      mode = selectedModes[0];

      const hasFlash = selectedModes.includes('flash');
      const flashExtras = document.getElementById('flashModeExtras');
      if (flashExtras) flashExtras.style.display = hasFlash ? 'block' : 'none';

      const hasIdentify = selectedModes.includes('identify');
      const netNote = document.getElementById('identifyNetNote');
      if (netNote) netNote.style.display = hasIdentify ? 'block' : 'none';

      updateStartButtonLabel();
    });
  });

  const quizBtn = document.getElementById('playStyleQuiz');
  const typeBtn = document.getElementById('playStyleTyping');

  function togglePlayStyle(clickedBtn) {
    const isCurrentlyActive = clickedBtn.classList.contains('active');
    const activeCount = document.querySelectorAll('#playStyleSelect .mode-btn.active').length;

    if (isCurrentlyActive && activeCount <= 1) return;

    clickedBtn.classList.toggle('active');

    selectedStyles = [];
    if (quizBtn?.classList.contains('active')) selectedStyles.push('quiz');
    if (typeBtn?.classList.contains('active')) selectedStyles.push('typing');

    const typeSection = document.getElementById('typeModeSection');
    const typeExtras = document.getElementById('typeModeExtras');
    const hasTyping = selectedStyles.includes('typing');
    if (typeSection) typeSection.style.display = hasTyping ? 'block' : 'none';
    if (typeExtras) typeExtras.classList.toggle('hidden', !hasTyping);

    const choicesRow = document.getElementById('choicesRow');
    if (choicesRow) {
      choicesRow.style.display = (!selectedStyles.includes('quiz') && hasTyping) ? 'none' : 'block';
    }
  }

  quizBtn?.addEventListener('click', () => togglePlayStyle(quizBtn));
  typeBtn?.addEventListener('click', () => togglePlayStyle(typeBtn));

  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.remove('hidden');
  });
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.add('hidden');
  });

  document.getElementById('openKeybindBtn')?.addEventListener('click', () => {
    document.getElementById('keybindPanel').style.display = 'block';
  });
  document.getElementById('keybindPanelDone')?.addEventListener('click', () => {
    document.getElementById('keybindPanel').style.display = 'none';
  });

  document.getElementById('openLeaderboardBtn')?.addEventListener('click', () => {
    document.getElementById('leaderboardPanel').style.display = 'block';
  });
  document.getElementById('leaderboardPanelDone')?.addEventListener('click', () => {
    document.getElementById('leaderboardPanel').style.display = 'none';
  });

  document.getElementById('openSpeciesBtn')?.addEventListener('click', () => {
    document.getElementById('speciesPanel').style.display = 'block';
  });
  document.getElementById('speciesPanelDone')?.addEventListener('click', () => {
    document.getElementById('speciesPanel').style.display = 'none';
  });

  document.getElementById('timeLimitSlider')?.addEventListener('input', (e) => {
    TIME_LIMIT = parseInt(e.target.value, 10);
    document.getElementById('timeLimitLabel').textContent = TIME_LIMIT + 's';
  });

  document.getElementById('btnSizeSlider')?.addEventListener('input', (e) => {
    const val = e.target.value;
    const sizes = { 1: '6px 8px', 2: '8px 10px', 3: '12px 12px', 4: '16px 14px', 5: '20px 16px' };
    document.documentElement.style.setProperty('--option-pad-y', sizes[val].split(' ')[0]);
    document.documentElement.style.setProperty('--option-pad-x', sizes[val].split(' ')[1]);
  });

  document.querySelectorAll('#countSelect .count-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#countSelect .count-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      TOTAL = parseInt(btn.dataset.count, 10);
      preferredQuizLength = TOTAL;
      updateStartButtonLabel();
    });
  });

  document.querySelectorAll('#choicesSelect .choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#choicesSelect .choice-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      NUM_CHOICES = parseInt(btn.dataset.choices, 10);
    });
  });

  document.getElementById('typeSubmitBtn')?.addEventListener('click', submitTypedAnswer);
  document.getElementById('typeAnswerInput')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') submitTypedAnswer();
  });

  nextBtn?.addEventListener('click', nextQuestion);
  document.getElementById('startOverBtn')?.addEventListener('click', () => window.startQuiz(isUltimate ? 'ultimate' : isGuest));
  document.getElementById('homeBtn')?.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });

  document.getElementById('hintBtn')?.addEventListener('click', () => {
    hintUsedThisQ = true;
    revealImage();
  });

  document.getElementById('cancelQuizBtn')?.addEventListener('click', () => {
    if (confirm('Leave quiz? Progress will be lost.')) {
      stopTimer();
      quizScreen.classList.add('hidden');
      stats.classList.add('hidden');
      startScreen.classList.remove('hidden');
      document.body.classList.remove('in-quiz');
    }
  });

  document.querySelectorAll('.flash-conf-btn').forEach(btn => {
    btn.addEventListener('click', () => nextQuestion());
  });
}

function renderKeybindList() {
  const container = document.getElementById('keybindList');
  if (!container) return;
  container.innerHTML = '';

  const meta = [
    { id: 'submit', label: 'Submit / confirm selection' },
    { id: 'next', label: 'Next question' },
    { id: 'hint', label: 'Reveal photo' },
    { id: 'left', label: 'Highlight left / prev' },
    { id: 'right', label: 'Highlight right / next' }
  ];

  meta.forEach(item => {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.06);';
    row.innerHTML = `<span style="font-size:0.85rem;">${item.label}</span>
      <button type="button" class="mode-btn" style="padding:4px 10px;min-width:60px;">${keyLabel(keybinds[item.id])}</button>`;
    
    const btn = row.querySelector('button');
    btn.addEventListener('click', () => {
      btn.textContent = '…';
      keybindListening = item.id;
    });
    container.appendChild(row);
  });
}

document.addEventListener('keydown', (e) => {
  if (keybindListening) {
    e.preventDefault();
    if (e.key !== 'Escape') keybinds[keybindListening] = e.key;
    keybindListening = null;
    renderKeybindList();
    return;
  }

  if (quizScreen && !quizScreen.classList.contains('hidden')) {
    if (e.key === keybinds.hint && !hintUsedThisQ) {
      hintUsedThisQ = true;
      revealImage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      setKbHighlight(kbHighlight - 1);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      setKbHighlight(kbHighlight + 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (answered) {
        nextQuestion();
      } else if (typeAnswerMode) {
        submitTypedAnswer();
      } else if (kbHighlight >= 0) {
        const opts = document.querySelectorAll('.option');
        if (opts[kbHighlight]) opts[kbHighlight].click();
      }
    }
  }
});

function initFamilySelect() {
  const list = document.getElementById('familyCheckList');
  const summary = document.getElementById('familySummary');
  if (!list) return;
  list.innerHTML = '';

  const indicesByFam = {};
  for (let i = 0; i < SPECIES.length; i++) {
    const n = SPECIES_FAMILY[i];
    if (!indicesByFam[n]) indicesByFam[n] = [];
    indicesByFam[n].push(i);
  }

  function updateSummary() {
    if (!summary) return;
    summary.textContent = !selectedSpecies.length
      ? `All species (${SPECIES.length})`
      : `${selectedSpecies.length} species selected`;
    updateStartButtonLabel();
  }

  function setSelected(indices) {
    selectedSpecies = indices.slice().sort((a, b) => a - b);
    const set = new Set(selectedSpecies);
    list.querySelectorAll('input.species-cb').forEach(cb => {
      cb.checked = set.has(parseInt(cb.dataset.idx, 10));
    });
    list.querySelectorAll('input.family-cb').forEach(cb => {
      const nums = indicesByFam[parseInt(cb.dataset.fam, 10)] || [];
      const on = nums.filter(i => set.has(i)).length;
      cb.checked = nums.length > 0 && on === nums.length;
      cb.indeterminate = on > 0 && on < nums.length;
    });
    updateSummary();
  }

  FAMILIES.forEach(f => {
    const idxs = indicesByFam[f.num] || [];
    const block = document.createElement('div');
    block.className = 'family-block';
    block.innerHTML = `
      <div class="family-block-head">
        <input type="checkbox" class="family-cb" data-fam="${f.num}">
        <span style="flex:1;cursor:pointer;">${f.num}. ${f.name} (${f.count})</span>
        <button type="button" class="family-expand">Species</button>
      </div>
      <div class="family-species-list"></div>
    `;

    const spList = block.querySelector('.family-species-list');
    idxs.forEach(si => {
      const pair = SPECIES[si];
      const lab = document.createElement('label');
      lab.className = 'species-check-item';
      lab.innerHTML = `<input type="checkbox" class="species-cb" data-idx="${si}">
                       <span>${pair[0]} — ${pair[1]}</span>`;
      spList.appendChild(lab);
    });

    const famCb = block.querySelector('.family-cb');
    famCb.addEventListener('change', () => {
      const set = new Set(selectedSpecies);
      idxs.forEach(i => famCb.checked ? set.add(i) : set.delete(i));
      setSelected([...set]);
    });

    block.querySelector('.family-expand').addEventListener('click', (e) => {
      spList.classList.toggle('open');
      e.target.textContent = spList.classList.contains('open') ? 'Hide' : 'Species';
    });

    spList.querySelectorAll('.species-cb').forEach(cb => {
      cb.addEventListener('change', () => {
        const idx = parseInt(cb.dataset.idx, 10);
        const set = new Set(selectedSpecies);
        cb.checked ? set.add(idx) : set.delete(idx);
        setSelected([...set]);
      });
    });

    list.appendChild(block);
  });

  document.getElementById('familyAllBtn')?.addEventListener('click', () => setSelected([]));

  const presets = [
    { id: 'quizTest1Toggle', sci: QUIZ_TEST_1_SCI },
    { id: 'quizTest2Toggle', sci: QUIZ_TEST_2_SCI },
    { id: 'quizTest3Toggle', sci: QUIZ_TEST_3_SCI },
    { id: 'quizTest4Toggle', sci: QUIZ_TEST_4_SCI },
    { id: 'quizTest5Toggle', sci: QUIZ_TEST_5_SCI }
  ];

  presets.forEach(p => {
    document.getElementById(p.id)?.addEventListener('change', () => {
      const want = new Set();
      presets.forEach(pr => {
        if (document.getElementById(pr.id)?.checked) {
          pr.sci.forEach(s => want.add(s.toLowerCase().trim()));
        }
      });
      if (want.size > 0) {
        const matches = [];
        SPECIES.forEach((pair, idx) => {
          if (want.has(pair[1].toLowerCase().trim())) matches.push(idx);
        });
        setSelected(matches);
      }
    });
  });

  updateSummary();
}

function updateStartButtonLabel() {
  const btn = document.getElementById('startBtn');
  if (btn) btn.textContent = `Start ${TOTAL}-question quiz`;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickQuestions() {
  const pool = selectedSpecies.length ? selectedSpecies.map(i => SPECIES[i]) : SPECIES.slice();
  const out = [];
  let bag = shuffle(pool);
  while (out.length < TOTAL && bag.length) out.push(bag.pop());
  while (out.length < TOTAL) {
    if (!bag.length) bag = shuffle(pool);
    out.push(bag.pop());
  }
  return out;
}

window.startQuiz = function(guestOrUltimate) {
  isGuest = guestOrUltimate === true;
  isUltimate = guestOrUltimate === 'ultimate';
  playerName = document.getElementById('playerName')?.value.trim() || 'Guest';

  questions = pickQuestions();
  TOTAL = questions.length;
  qIndex = 0;
  score = 0;
  streak = 0;
  missed = [];

  startScreen.classList.add('hidden');
  endScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  stats.classList.remove('hidden');
  document.body.classList.add('in-quiz');

  showQuestion();
};

function showQuestion() {
  feedback.classList.add('hidden');
  nextBtn.classList.add('hidden');
  optionsEl.innerHTML = '';
  answered = false;
  hintUsedThisQ = false;
  clearKbHighlight();

  const currentMode = selectedModes[Math.floor(Math.random() * selectedModes.length)] || 'sci-to-common';
  const currentStyle = selectedStyles[Math.floor(Math.random() * selectedStyles.length)] || 'quiz';
  mode = currentMode;
  typeAnswerMode = (currentStyle === 'typing' && mode !== 'flash' && mode !== 'invasive');

  const pair = questions[qIndex];
  currentPair = pair;

  const flashCard = document.getElementById('flashCard');
  const flashConfRow = document.getElementById('flashConfidenceRow');
  if (mode === 'flash') {
    flashCard?.classList.remove('hidden');
    flashConfRow?.classList.remove('hidden');
    optionsEl.classList.add('hidden');
    document.getElementById('typeAnswerArea')?.classList.add('hidden');

    promptLabel.textContent = 'Flash card';
    promptEl.textContent = '';
    document.getElementById('flashCommon').textContent = withPron(pair[0]);
    document.getElementById('flashSci').textContent = withPron(pair[1]);
    document.getElementById('flashFamily').textContent = familyNameForPair(pair) || '—';

    const info = SPECIES_INFO[pair[1].toLowerCase()] || {};
    document.getElementById('flashLeaf').textContent = info.leaf || '—';
    document.getElementById('flashZones').textContent = info.zones ? 'USDA ' + info.zones : '—';
    document.getElementById('flashRange').textContent = info.range || '—';
    document.getElementById('flashNotes').textContent = info.notes || '—';
    document.getElementById('flashInvasive').textContent = info.invasive ? 'Yes — often invasive' : 'No / Native';

    document.getElementById('qNum').textContent = qIndex + 1;
    document.getElementById('totalQ').textContent = TOTAL;
    progressBar.style.width = ((qIndex / TOTAL) * 100) + '%';
    loadPhoto(pair[1]);
    return;
  } else {
    flashCard?.classList.add('hidden');
    flashConfRow?.classList.add('hidden');
  }

  if (mode === 'common-to-sci') {
    promptLabel.textContent = 'Scientific name';
    promptEl.textContent = withPron(pair[0]);
    currentCorrect = pair[1];
  } else if (mode === 'family') {
    promptLabel.textContent = 'What family?';
    promptEl.textContent = withPron(pair[0]) + '\n' + withPron(pair[1]);
    currentCorrect = familyNameForPair(pair);
  } else if (mode === 'invasive') {
    promptLabel.textContent = 'Invasive or not?';
    promptEl.textContent = withPron(pair[0]) + '\n' + withPron(pair[1]);
    const info = SPECIES_INFO[pair[1].toLowerCase()] || {};
    currentCorrect = info.invasive ? 'Invasive' : 'Not invasive';
  } else {
    promptLabel.textContent = mode === 'identify' ? 'Name the tree in the photo' : 'Common name';
    promptEl.textContent = mode === 'identify' ? 'Identify common name:' : withPron(pair[1]);
    currentCorrect = pair[0];
  }

  document.getElementById('qNum').textContent = qIndex + 1;
  document.getElementById('totalQ').textContent = TOTAL;
  progressBar.style.width = ((qIndex / TOTAL) * 100) + '%';

  const typeArea = document.getElementById('typeAnswerArea');
  const typeInput = document.getElementById('typeAnswerInput');

  if (typeAnswerMode) {
    optionsEl.classList.add('hidden');
    typeArea?.classList.remove('hidden');
    if (typeInput) {
      typeInput.value = '';
      typeInput.disabled = false;
      setTimeout(() => typeInput.focus(), 50);
    }
  } else {
    typeArea?.classList.add('hidden');
    optionsEl.classList.remove('hidden');

    let choices = [currentCorrect];
    if (mode === 'invasive') {
      choices = ['Invasive', 'Not invasive'];
    } else if (mode === 'family') {
      const famPool = FAMILIES.map(f => `${f.num}. ${f.name}`).filter(f => f !== currentCorrect);
      shuffle(famPool).slice(0, NUM_CHOICES - 1).forEach(c => choices.push(c));
    } else {
      const pool = SPECIES.map(p => (mode === 'common-to-sci' ? p[1] : p[0])).filter(n => n !== currentCorrect);
      shuffle(pool).slice(0, NUM_CHOICES - 1).forEach(c => choices.push(c));
    }

    shuffle(choices).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.textContent = withPron(opt);
      btn.addEventListener('click', () => selectAnswer(btn, opt));
      optionsEl.appendChild(btn);
    });
  }

  loadPhoto(pair[1]);
  startTimer();
}

function submitTypedAnswer() {
  if (answered) return;
  const input = document.getElementById('typeAnswerInput');
  const typed = (input?.value || '').trim();
  const ok = (typed.toLowerCase() === currentCorrect.toLowerCase()) || 
             (mode === 'family' && typed.toLowerCase().includes(currentCorrect.toLowerCase().split('. ')[1] || ''));

  selectAnswer(document.createElement('div'), ok ? currentCorrect : typed);
}

function selectAnswer(btn, chosen) {
  if (answered) return;
  answered = true;
  stopTimer();

  optionsEl.querySelectorAll('.option').forEach(o => o.disabled = true);
  const correct = chosen.toLowerCase() === currentCorrect.toLowerCase();

  if (correct) {
    btn.classList.add('correct');
    score++;
    streak++;
    feedback.textContent = '✓ Correct!';
    feedback.className = 'feedback correct';
  } else {
    btn.classList.add('wrong');
    streak = 0;
    missed.push(currentPair);
    if (isUltimate) questions.push(currentPair);
    optionsEl.querySelectorAll('.option').forEach(o => {
      if (o.textContent.includes(currentCorrect)) o.classList.add('correct');
    });
    feedback.textContent = `✗ Wrong — Correct: ${currentCorrect}`;
    feedback.className = 'feedback wrong';
  }

  feedback.classList.remove('hidden');
  revealImage();
  nextBtn.classList.remove('hidden');
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
}

function nextQuestion() {
  qIndex++;
  if (qIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  stopTimer();
  quizScreen.classList.add('hidden');
  stats.classList.add('hidden');
  endScreen.classList.remove('hidden');
  document.body.classList.remove('in-quiz');
  document.getElementById('endMsg').textContent = `Final Score: ${score}/${TOTAL} (${Math.round((score / TOTAL) * 100)}%)`;
}

function updateTimerDisplay() {
  if (!timerText || !timerBar) return;
  timerText.textContent = timeLeft;
  timerBar.style.width = (timeLeft / TIME_LIMIT * 100) + '%';
}

function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  updateTimerDisplay();
  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      if (!answered) selectAnswer(document.createElement('div'), '');
    }
  }, 1000);
}

async function loadPhoto(sciName) {
  speciesImg.classList.remove('revealed');
  speciesImg.removeAttribute('src');
  try {
    const res = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(sciName)}&per_page=1`);
    const data = await res.json();
    const taxon = data.results?.[0];
    if (taxon?.default_photo?.medium_url) {
      speciesImg.src = taxon.default_photo.medium_url;
      if (hintUsedThisQ || mode === 'identify') revealImage();
    }
  } catch (e) {}
}

function revealImage() {
  speciesImg?.classList.add('revealed');
  if (imgPlaceholder) imgPlaceholder.style.opacity = '0';
}

function renderLeaderboard() {
  const box = document.getElementById('leaderboardList');
  if (box) box.innerHTML = '<span class="lb-empty">Ready for scores!</span>';
}

document.addEventListener('DOMContentLoaded', loadDataAndInit);
