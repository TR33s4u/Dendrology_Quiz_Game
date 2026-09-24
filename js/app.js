/* ============================================================================
   DENDROLOGY QUIZ ENGINE (js/app.js)
   ---------------------------------------------------------------------------
   Modular game controller:
   - Fetches data/species.json on load
   - Handles game modes: sci-to-common, common-to-sci, family, flash, identify, invasive
   - Handles typing inputs, multiple-choice, study tracker, and scoring
============================================================================ */

// Global collections populated from data/species.json
let SPECIES = [];
let SPECIES_FAMILY = [];
let COMMON_TO_SCI = {};
let SCI_TO_COMMON = {};

// Botanical Families 1-50
const FAMILIES = [
  { num: 1, name: "Adoxaceae", count: 3 },
  { num: 2, name: "Altingiaceae", count: 1 },
  { num: 3, name: "Anacardiaceae", count: 4 },
  { num: 4, name: "Annonaceae", count: 1 },
  { num: 5, name: "Apocynaceae", count: 1 },
  { num: 6, name: "Aquifoliaceae", count: 3 },
  { num: 7, name: "Araliaceae", count: 3 },
  { num: 8, name: "Berberidaceae", count: 1 },
  { num: 9, name: "Betulaceae", count: 11 },
  { num: 10, name: "Bignoniaceae", count: 1 },
  { num: 11, name: "Caesalpiniaceae", count: 3 },
  { num: 12, name: "Cannabaceae", count: 1 },
  { num: 13, name: "Caprifoliaceae", count: 2 },
  { num: 14, name: "Celastraceae", count: 2 },
  { num: 15, name: "Cornaceae", count: 5 },
  { num: 16, name: "Cupressaceae", count: 4 },
  { num: 17, name: "Ebenaceae", count: 1 },
  { num: 18, name: "Ericaceae", count: 9 },
  { num: 19, name: "Fabaceae", count: 5 },
  { num: 20, name: "Fagaceae", count: 17 },
  { num: 21, name: "Ginkgoaceae", count: 1 },
  { num: 22, name: "Hamamelidaceae", count: 1 },
  { num: 23, name: "Juglandaceae", count: 7 },
  { num: 24, name: "Lauraceae", count: 2 },
  { num: 25, name: "Lythraceae", count: 1 },
  { num: 26, name: "Magnoliaceae", count: 4 },
  { num: 27, name: "Mimosaceae", count: 1 },
  { num: 28, name: "Moraceae", count: 2 },
  { num: 29, name: "Nyssaceae", count: 1 },
  { num: 30, name: "Oleaceae", count: 3 },
  { num: 32, name: "Paulowniaceae", count: 1 },
  { num: 33, name: "Pinaceae", count: 16 },
  { num: 34, name: "Platanaceae", count: 1 },
  { num: 35, name: "Rosaceae", count: 14 },
  { num: 36, name: "Salicaceae", count: 7 },
  { num: 37, name: "Sapindaceae", count: 10 },
  { num: 38, name: "Simaroubaceae", count: 1 },
  { num: 39, name: "Taxaceae", count: 1 },
  { num: 40, name: "Tiliaceae", count: 2 },
  { num: 41, name: "Ulmaceae", count: 3 },
  { num: 42, name: "Vitaceae", count: 2 },
  { num: 43, name: "Grossulariaceae", count: 1 },
  { num: 44, name: "Myricaceae", count: 1 },
  { num: 45, name: "Hydrangeaceae", count: 1 },
  { num: 46, name: "Smilacaceae", count: 1 },
  { num: 47, name: "Staphyleaceae", count: 1 },
  { num: 48, name: "Thymelaeaceae", count: 1 },
  { num: 49, name: "Elaeagnaceae", count: 1 },
  { num: 50, name: "Polygonaceae", count: 1 }
];

const QUIZ_TEST_1_SCI = [
  "asimina triloba", "ilex opaca", "robinia pseudoacacia", "juglans nigra",
  "sassafras albidum", "lindera benzoin", "liriodendron tulipifera",
  "fraxinus americana", "paulownia tomentosa", "pinus strobus",
  "tsuga canadensis", "platanus occidentalis", "acer saccharum",
  "acer negundo", "aesculus flava", "parthenocissus quinquefolia",
  "toxicodendron radicans", "carpinus caroliniana", "elaeagnus umbellate",
  "Reynoutria japonica"
];

const QUIZ_TEST_2_SCI = [
  "Cercis canadensis", "Quercus alba", "Quercus montana", "Quercus coccinea",
  "Quercus marilandica", "Prunus serotina", "Pyrus calleryana",
  "Acer platanoides", "Ailanthus altissima", "Tilia americana"
];

const QUIZ_TEST_3_SCI = [
  "Quercus rubra", "Magnolia acuminata", "Acer pensylvanicum", "Cornus florida",
  "Acer rubrum", "Quercus velutina", "Smilax spp.", "Carya cordiformis", "Berbis spp."
];

const QUIZ_TEST_4_SCI = [
  "Nyssa sylvatica", "Fagus grandifolia", "Pinus rigida", "Pinus virginiana",
  "Oxydendrum arboreum", "Quercus falcata", "Juniperus virginiana",
  "Albizia julibrissin", "Quercus stellata", "Diospyros virginiana"
];

const QUIZ_TEST_5_SCI = [
  "Malus pumila", "Pinus taeda", "Quercus phellos", "Hedera helix",
  "Catalpa speciosa", "Cornus kousa", "Carya glabra var.glabra",
  "Fraxinus pennsylvanica", "Rubus phoenicolasius", "Ulmus rubra",
  "Rosa multiflora", "Cupressocyparis leylandii", "Acer saccharinum"
];

const SPECIES_INFO = {
  'abies balsamea': { form: 'tree', leaf: 'evergreen', zones: '3–5', range: 'NE. U.S. & Canada', notes: 'balsam fir; Christmas tree', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer negundo': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'most of U.S. & S. Canada', notes: 'boxelder; compound leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer nigrum': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'NE. & C. U.S.', notes: 'black maple; close to sugar maple', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer palmatum': { form: 'tree / shrub', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'Japanese maple', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer pensylvanicum': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & Appalachians', notes: 'striped bark — moosewood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer platanoides': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'Europe (invasive in NE. U.S.)', notes: 'Norway maple; milky sap', invasive: true, invasiveWhere: 'northeastern & Great Lakes states', invasiveRegion: 'northeast' },
  'acer rubrum': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'red maple; very wide site tolerance', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer saccharinum': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'silver maple; deep sinuses', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'acer saccharum': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'sugar maple; maple syrup', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'aesculus flava': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'Appalachians & Ohio Valley', notes: 'yellow buckeye; palmate leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'aesculus hippocastanum': { form: 'tree', leaf: 'deciduous', zones: '4–7', range: 'Balkans (planted)', notes: 'horse chestnut; sticky buds', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ailanthus altissima': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'China (invasive widely)', notes: 'tree-of-heaven; foul odor when crushed', invasive: true, invasiveWhere: 'most of the contiguous U.S.', invasiveRegion: 'nationwide' },
  'albizia julibrissin': { form: 'tree', leaf: 'deciduous', zones: '6–9', range: 'Asia (naturalized SE. U.S.)', notes: 'pink powderpuff flowers', invasive: true, invasiveWhere: 'southeastern states', invasiveRegion: 'southeast' },
  'alnus serrulata': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S. wetlands', notes: 'nitrogen-fixing', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'amelanchier arborea': { form: 'tree / shrub', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'serviceberry; early white flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'aralia spinosa': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'spiny stems; large compound leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'asimina triloba': { form: 'tree / shrub', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'largest native edible fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'berbis spp.': { form: 'shrub', leaf: 'deciduous / semi-evergreen', zones: '4–8', range: 'many spp.; often Eurasian', notes: 'spiny; often invasive cultivars', invasive: true, invasiveWhere: 'many states (esp. Japanese barberry)', invasiveRegion: 'east' },
  'betula alleghaniensis': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & E. Canada; Appalachians', notes: 'yellow peeling bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'betula lenta': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'Appalachians & NE. U.S.', notes: 'wintergreen scent in twigs', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'betula nigra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S. floodplains', notes: 'peeling salmon bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'betula papyrifera': { form: 'tree', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'white peeling bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'betula pendula': { form: 'tree', leaf: 'deciduous', zones: '2–7', range: 'Europe & Asia (planted)', notes: 'European white birch', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'betula populifolia': { form: 'tree', leaf: 'deciduous', zones: '3–6', range: 'NE. U.S. & SE. Canada', notes: 'pioneer species', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carpinus caroliniana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'fluted muscle-like trunk', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carya cordiformis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'bitternut; sulfur-yellow buds', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carya glabra var.glabra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'pignut; pear-shaped nut', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carya ovalis': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. U.S.', notes: 'red hickory', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carya ovata': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. North America', notes: 'shaggy bark plates', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'carya tomentosa': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'mockernut; thick husk', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'castanea dentata': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. U.S. (blight-reduced)', notes: 'American chestnut — blight history', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'castanea pumila': { form: 'shrub / small tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'chinkapin; edible nuts', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'catalpa speciosa': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'C. U.S. (widely planted)', notes: 'large heart leaves; long pods', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'celastrus orbiculatus': { form: 'vine', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive E. U.S.)', notes: 'smothering vine; orange arils', invasive: true, invasiveWhere: 'most eastern & midwestern states', invasiveRegion: 'east' },
  'celtis occidentalis': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'E. & C. North America', notes: 'warty bark; small sweet fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cercis canadensis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'pink flowers on bare wood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'chimaphila maculata': { form: 'groundcover', leaf: 'evergreen', zones: '4–7', range: 'E. North America forests', notes: 'striped leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'chionanthus virginicus': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'fringe-like white flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cladrastis lutea': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'SE. U.S. limited range', notes: 'white hanging flower clusters', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'comptonia peregrina': { form: 'shrub', leaf: 'deciduous', zones: '2–6', range: 'E. North America', notes: 'aromatic fern-like leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cornus alternifolia': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–7', range: 'E. North America', notes: 'alternate leaves; pagoda form', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cornus florida': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'showy bracts; anthracnose sensitive', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cornus kousa': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'pointed bracts; summer bloom', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cornus obliqua': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'E. North America wetlands', notes: 'silky hairs under leaf', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cornus stolonifera': { form: 'shrub', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'red stems in winter', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'corylus americana': { form: 'shrub', leaf: 'deciduous', zones: '4–9', range: 'E. & C. North America', notes: 'edible nuts', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'corylus cornuta': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'N. North America', notes: 'beaked husk on nut', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'crataegus spp.': { form: 'tree / shrub', leaf: 'deciduous', zones: '3–8', range: 'N. Hemisphere (many spp.)', notes: 'hawthorn; thorns', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'cupressocyparis leylandii': { form: 'tree', leaf: 'evergreen', zones: '6–10', range: 'hybrid (planted)', notes: 'fast privacy screen', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'diospyros virginiana': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'sweet fruit after frost', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'dirca palustris': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'very flexible stems — leatherwood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'elaeagnus umbellate': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'Asia (invasive E. U.S.)', notes: 'autumn olive; silver scales', invasive: true, invasiveWhere: 'most eastern & midwestern states', invasiveRegion: 'east' },
  'euonymus americana': { form: 'shrub', leaf: 'deciduous', zones: '5–9', range: 'E. U.S.', notes: 'warty red fruit — hearts-a-bustin\'', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'fagus grandifolia': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'smooth gray bark; hold leaves in winter', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'fraxinus americana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'emerald ash borer threat', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'fraxinus pennsylvanica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. North America', notes: 'emerald ash borer threat', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'gaultheria procumbens': { form: 'groundcover', leaf: 'evergreen', zones: '3–8', range: 'E. North America', notes: 'wintergreen scent; red berries', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'gaylussacia spp.': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'huckleberry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ginkgo biloba': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'China (widely planted)', notes: 'fan leaves; living fossil', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'gleditsia triacanthos': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'C. U.S.', notes: 'long thorns; large pods', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'gleditsia triacanthos(var. inermis)': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'cultivar of native', notes: 'thornless form', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'gymnocladus dioicus': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. U.S.', notes: 'large bipinnate leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'hamamelis virginiana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'late fall flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'hedera helix': { form: 'vine', leaf: 'evergreen', zones: '5–11', range: 'Europe (naturalized)', notes: 'can be invasive', invasive: true, invasiveWhere: 'Pacific NW & parts of the East', invasiveRegion: 'east_west' },
  'hydrangea arborescens': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'wild hydrangea; white clusters', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ilex montana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '5–7', range: 'Appalachians', notes: 'mountain holly', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ilex opaca': { form: 'tree', leaf: 'evergreen', zones: '5–9', range: 'E. U.S. coastal plain & Piedmont', notes: 'dioecious; red berries on female', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ilex verticillata': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'bright winter berries', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'juglans cinerea': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'NE. U.S. & SE. Canada', notes: 'butternut canker threatens stands', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'juglans nigra': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. & C. U.S.', notes: 'chambered pith; valuable wood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'juniperus virginiana': { form: 'tree', leaf: 'evergreen', zones: '2–9', range: 'E. & C. U.S.', notes: 'dioecious; blue cones on female', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'kalmia latifolia': { form: 'shrub', leaf: 'evergreen', zones: '4–9', range: 'E. U.S.', notes: 'toxic foliage; showy flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'lagerstroemia indica': { form: 'tree / shrub', leaf: 'deciduous', zones: '7–9', range: 'Asia (planted SE. U.S.)', notes: 'crape myrtle; peeling bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'larix spp.': { form: 'tree', leaf: 'deciduous conifer', zones: '2–5', range: 'N. Hemisphere boreal', notes: 'larch — needles drop in fall', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'lindera benzoin': { form: 'shrub', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'spicebush; yellow spring flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'liquidambar styraciflua': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S. to NY; Mexico', notes: 'star-shaped leaves; spiny fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'liriodendron tulipifera': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'tulip-shaped leaves & flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'lonicera japonica': { form: 'vine', leaf: 'semi-evergreen', zones: '4–9', range: 'Asia (invasive E. U.S.)', notes: 'fragrant flowers; invasive', invasive: true, invasiveWhere: 'most eastern states', invasiveRegion: 'east' },
  'maclura pomifera': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'S.-C. U.S. (planted widely)', notes: 'hedge-apple; milky sap', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'magnolia acuminata': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'E. U.S. & Appalachians', notes: 'cucumber-like fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'magnolia fraseri': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'S. Appalachians', notes: 'ear-lobed leaf base', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'magnolia grandiflora': { form: 'tree', leaf: 'evergreen', zones: '7–9', range: 'SE. U.S.', notes: 'large white flowers; glossy leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'malus pumila': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. Asia origin (planted)', notes: 'common apple', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'morus rubra': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. U.S.', notes: 'edible multiple fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'nyssa sylvatica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. U.S.', notes: 'brilliant fall color; wet or dry sites', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ostrya virginiana': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'hop-like fruit; hard wood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'oxydendrum arboreum': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S. & Appalachians', notes: 'sour leaves; late white flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'panax quinquefolius': { form: 'herb', leaf: 'deciduous', zones: '3–8', range: 'E. North America forests', notes: 'protected / slow-growing', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'parthenocissus quinquefolia': { form: 'vine', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'Virginia creeper; 5 leaflets', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'paulownia tomentosa': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'China (naturalized E. U.S.)', notes: 'huge leaves; violet flowers', invasive: true, invasiveWhere: 'eastern & midwestern states', invasiveRegion: 'east' },
  'picea abies': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Europe (planted)', notes: 'Norway spruce; pendulous cones', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'picea glauca': { form: 'tree', leaf: 'evergreen', zones: '2–6', range: 'N. North America', notes: 'white spruce', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'picea pungens': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Rocky Mountains (planted E.)', notes: 'blue spruce', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'picea rubens': { form: 'tree', leaf: 'evergreen', zones: '2–5', range: 'NE. U.S. & SE. Canada; Appalachians', notes: 'red spruce', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'pieris floribunda': { form: 'shrub', leaf: 'evergreen', zones: '4–6', range: 'S. Appalachians', notes: 'mountain fetterbush', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'pinus echinata': { form: 'tree', leaf: 'evergreen', zones: '6–9', range: 'SE. U.S.', notes: 'shortleaf; 2 needles', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Moderate–high' },
  'pinus palustris': { form: 'tree', leaf: 'evergreen', zones: '7–9', range: 'SE. U.S. coastal plain', notes: 'longleaf; grass stage', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Very high' },
  'pinus pungens': { form: 'tree', leaf: 'evergreen', zones: '5–7', range: 'Appalachians', notes: 'Table Mountain pine; armed cones', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Moderate' },
  'pinus resinosa': { form: 'tree', leaf: 'evergreen', zones: '2–5', range: 'NE. U.S. & SE. Canada', notes: 'red pine; brittle needles snap', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Moderate' },
  'pinus rigida': { form: 'tree', leaf: 'evergreen', zones: '4–7', range: 'NE. U.S. & Appalachians', notes: 'pitch pine; epicormic sprouts', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'High' },
  'pinus strobus': { form: 'tree', leaf: 'evergreen', zones: '3–8', range: 'NE. U.S. & SE. Canada; Appalachians', notes: '5 needles in fascicle', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Low–moderate' },
  'pinus sylvestris': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'Europe & Asia (planted)', notes: 'scotch pine; orange upper bark', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Moderate' },
  'pinus taeda': { form: 'tree', leaf: 'evergreen', zones: '6–9', range: 'SE. U.S.', notes: 'loblolly; major timber pine', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Moderate' },
  'pinus virginiana': { form: 'tree', leaf: 'evergreen', zones: '4–8', range: 'E. U.S.', notes: 'Virginia pine; twisted needles', invasive: false, invasiveWhere: '', invasiveRegion: '', fireTolerance: 'Low–moderate' },
  'platanus occidentalis': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. North America', notes: 'mottled bark; large leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'populus alba': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'Europe & Asia (planted)', notes: 'white poplar; white leaf undersides', invasive: true, invasiveWhere: 'parts of the Northeast & West', invasiveRegion: 'northeast' },
  'populus balsamifera': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'N. North America', notes: 'balsam poplar; fragrant buds', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'populus grandidentata': { form: 'tree', leaf: 'deciduous', zones: '3–5', range: 'NE. U.S. & SE. Canada', notes: 'bigtooth aspen', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'populus nigra var. italica': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'cultivar (planted)', notes: 'Lombardy poplar; columnar', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'populus tremuloides': { form: 'tree', leaf: 'deciduous', zones: '1–6', range: 'N. North America', notes: 'quaking aspen; wide range', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'prunus avium': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'Europe (planted)', notes: 'sweet cherry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'prunus pendula': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'Japan (planted)', notes: 'weeping cherry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'prunus pensylvanica': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'N. North America', notes: 'fire / pin cherry; pioneer', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'prunus serotina': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'black cherry; valued wood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'prunus virginiana': { form: 'shrub / small tree', leaf: 'deciduous', zones: '2–7', range: 'N. North America', notes: 'chokecherry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'pueraria montana': { form: 'vine', leaf: 'deciduous', zones: '5–10', range: 'Asia (invasive SE. U.S.)', notes: 'kudzu — highly invasive', invasive: true, invasiveWhere: 'southeastern states', invasiveRegion: 'southeast' },
  'pyrus calleryana': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'China (invasive E. U.S.)', notes: 'Bradford / Callery pear — invasive', invasive: true, invasiveWhere: 'most eastern & midwestern states', invasiveRegion: 'east' },
  'quercus acutissima': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. Asia (planted)', notes: 'sawtooth margins', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus alba': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'white oak group; rounded lobes', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus coccinea': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'deep scarlet fall color', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus falcata': { form: 'tree', leaf: 'deciduous', zones: '6–9', range: 'SE. U.S.', notes: 'southern red oak; bell-shaped base', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus ilicifolia': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–7', range: 'NE. U.S. barrens', notes: 'bear / scrub oak', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus macrocarpa': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'C. North America', notes: 'bur oak; large fringed acorns', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus marilandica': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. & C. U.S. dry sites', notes: 'blackjack oak; leathery leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus michauxii': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S. bottomlands', notes: 'swamp chestnut oak', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus montana': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'Appalachians & NE. U.S.', notes: 'chestnut oak; blocky bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus palustris': { form: 'tree', leaf: 'deciduous', zones: '4–8', range: 'E. & C. U.S.', notes: 'pin oak; lower limbs droop', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus phellos': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'SE. U.S.', notes: 'willow-like leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus rubra': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'E. North America', notes: 'northern red oak; pointed lobes', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus stellata': { form: 'tree', leaf: 'deciduous', zones: '5–9', range: 'E. & C. U.S.', notes: 'cross-shaped leaf tips', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'quercus velutina': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'black oak; yellow inner bark', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'reynoutria japonica': { form: 'herbaceous shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive)', notes: 'Japanese knotweed — invasive', invasive: true, invasiveWhere: 'most states where established', invasiveRegion: 'nationwide' },
  'rhododendron maximum': { form: 'shrub', leaf: 'evergreen', zones: '3–7', range: 'Appalachians', notes: 'large leathery leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rhododendron spp.': { form: 'shrub', leaf: 'deciduous / evergreen', zones: '4–8', range: 'E. North America (varies by spp.)', notes: 'azaleas & rhododendrons', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rhus copallina': { form: 'shrub / small tree', leaf: 'deciduous', zones: '4–9', range: 'E. & S. U.S.', notes: 'winged rachis', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rhus glabra': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–9', range: 'most of U.S. & S. Canada', notes: 'smooth stems', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rhus typhina': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'hairy twigs; red fruit clusters', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ribes spp.': { form: 'shrub', leaf: 'deciduous', zones: '3–7', range: 'N. & montane North America', notes: 'gooseberry / currant', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'robinia pseudoacacia': { form: 'tree', leaf: 'deciduous', zones: '3–8', range: 'Appalachians (naturalized widely)', notes: 'fragrant white flowers', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rosa multiflora': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (invasive E. U.S.)', notes: 'multiflora rose — invasive', invasive: true, invasiveWhere: 'most eastern & midwestern states', invasiveRegion: 'east' },
  'rubus allegheniensis': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'blackberry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rubus occidentalis': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'black raspberry', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'rubus phoenicolasius': { form: 'shrub', leaf: 'deciduous', zones: '4–8', range: 'Asia (naturalized E. U.S.)', notes: 'wine raspberry', invasive: true, invasiveWhere: 'northeastern states', invasiveRegion: 'northeast' },
  'salix babylonica': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'China (planted)', notes: 'weeping willow', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'salix nigra': { form: 'tree', leaf: 'deciduous', zones: '2–8', range: 'E. North America', notes: 'black willow; wet sites', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'sambucus canadensis': { form: 'shrub', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'edible berries when cooked', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'sassafras albidum': { form: 'tree', leaf: 'deciduous', zones: '4–9', range: 'E. U.S.', notes: 'mitten / 3-lobed leaves; spicy scent', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'smilax spp.': { form: 'vine', leaf: 'deciduous / evergreen', zones: '4–9', range: 'E. North America', notes: 'greenbrier', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'sorbus americana': { form: 'tree', leaf: 'deciduous', zones: '2–5', range: 'NE. U.S. & SE. Canada', notes: 'orange-red fruit clusters', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'staphylea trifolia': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'inflated bladder-like fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'symphoricarpos orbiculatus': { form: 'shrub', leaf: 'deciduous', zones: '2–8', range: 'E. & C. U.S.', notes: 'coral-pink fruit', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'taxodium distichum var. distichum': { form: 'tree', leaf: 'deciduous conifer', zones: '4–10', range: 'SE. U.S. wetlands', notes: 'knees in wet sites', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'taxus spp.': { form: 'shrub / tree', leaf: 'evergreen', zones: '4–7', range: 'N. Hemisphere', notes: 'yew; seeds toxic', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'thuja occidentalis': { form: 'tree', leaf: 'evergreen', zones: '2–7', range: 'NE. U.S. & SE. Canada', notes: 'flat sprays; scale leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'tilia americana': { form: 'tree', leaf: 'deciduous', zones: '2–8', range: 'E. North America', notes: 'American basswood', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'tilia cordata': { form: 'tree', leaf: 'deciduous', zones: '3–7', range: 'Europe (planted)', notes: 'littleleaf linden', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'toxicodendron radicans': { form: 'vine / shrub', leaf: 'deciduous', zones: '3–10', range: 'E. & C. North America', notes: 'urushiol — do not touch', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'tsuga canadensis': { form: 'tree', leaf: 'evergreen', zones: '3–7', range: 'E. North America', notes: 'hemlock; HWA threat', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ulmus americana': { form: 'tree', leaf: 'deciduous', zones: '2–9', range: 'E. North America', notes: 'American elm', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'ulmus rubra': { form: 'tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. U.S.', notes: 'slippery elm', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'vaccinium spp.': { form: 'shrub', leaf: 'deciduous / evergreen', zones: '2–8', range: 'E. North America', notes: 'blueberry / cranberry allies', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'viburnum acerifolium': { form: 'shrub', leaf: 'deciduous', zones: '3–8', range: 'E. North America', notes: 'maple-like leaves', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'viburnum prunifolium': { form: 'shrub / small tree', leaf: 'deciduous', zones: '3–9', range: 'E. & C. North America', notes: 'black fruit; fall color', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'vinca minor': { form: 'groundcover vine', leaf: 'evergreen', zones: '4–9', range: 'Europe (naturalized)', notes: 'periwinkle; invasive', invasive: true, invasiveWhere: 'many states', invasiveRegion: 'east' },
  'vitis spp.': { form: 'vine', leaf: 'deciduous', zones: '3–9', range: 'E. North America', notes: 'wild grape', invasive: false, invasiveWhere: '', invasiveRegion: '' },
  'wisteria spp.': { form: 'vine', leaf: 'deciduous', zones: '5–9', range: 'Asia / native spp.', notes: 'some spp. invasive', invasive: true, invasiveWhere: 'SE states', invasiveRegion: 'southeast' },
  'zelkova serrata': { form: 'tree', leaf: 'deciduous', zones: '5–8', range: 'E. Asia (planted)', notes: 'Japanese zelkova', invasive: false, invasiveWhere: '', invasiveRegion: '' }
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

// State Variables
let TIME_LIMIT = 15;
let TOTAL = 10;
let preferredQuizLength = 10;
let NUM_CHOICES = 4;
let PIC_APPEAR_AT = 5;
let selectedSpecies = [];
let mode = 'sci-to-common';
let selectedModes = ['sci-to-common'];
let selectedStyles = ['quiz'];
let selectedIdentifyAnswers = ['common'];
let identifyAnswerForm = 'common';
let IDENTIFY_PHOTO_COUNT = 10;
let questionModes = [];
let questionTypeAnswer = [];
let questionIdentifyForm = [];
let score = 0;
let streak = 0;
let qIndex = 0;
let currentCorrect = '';
let currentPair = null;
let questions = [];
let missed = [];
let answeredAfterPicTime = [];
let hintUsedThisQ = false;
let photoLoadGen = 0;
let isGuest = false;
let playerName = '';
let isUltimate = false;
let isRetry = false;
let lastStartMode = false;
let noPictures = false;
let speakEnabled = false;
let SPEAK_DETAIL = 2;
let showPronunciations = false;
let showFamilyNames = false;
let showOptionMatches = true;
let showOptionFamilies = false;
let optionsFromPoolOnly = false;
let typeAnswerMode = false;
let typeTimerOff = false;
let typeSuggest = true;
let typeHalfCreditPending = false;
let typeRetakeUsed = false;
let typePendingRevealOrRetake = false;
let flashLookalikes = false;
let flashInfinite = false;
let practicePresetActive = false;
let practiceIntersectActive = false;
let timerId = null;
let timeLeft = TIME_LIMIT;
let answered = false;

// Photos and Identification Cache
let currentPhotoCandidates = [];
let currentPhotoIndex = 0;
let currentPhotoTaxonName = '';
let identifyPhotoCursor = {};
let identifyPhotoCache = {};
let identifyNoPhotoKeys = {};
let identifySkipRetries = 0;
let identifyDisplayGen = 0;
let identifyDisplayKey = '';
let identifyTimerPending = false;
let identifyLockedUrl = '';
let identifyReadyPending = false;

const STUDY_STORE_KEY = 'dendrologyStudyTracker_v1';
const SKIPPED_PHOTO_URLS_KEY = 'dendrologySkippedPhotoUrls';

// DOM Selectors
let modeBtns, startScreen, quizScreen, endScreen, stats, promptEl, promptLabel;
let optionsEl, feedback, nextBtn, progressBar, timerBar, timerText, speciesImg;
let imgPlaceholder, imgLoading, imgCredit;

// Helper: Phonetics & Lookup
function withPron(name) {
  if (!showPronunciations || !name) return name;
  const p = PRON[name] || PRON[String(name).toLowerCase()];
  return p ? name + ' (' + p + ')' : name;
}

function otherName(name) {
  return COMMON_TO_SCI[name] || SCI_TO_COMMON[name] || null;
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
  return f ? (f.num + '. ' + f.name) : String(num);
}

function cleanSciName(name) {
  return (name || '')
    .replace(/\s*\(var\.\s*[^)]+\)/gi, '')
    .replace(/\s*spp\.?/gi, '')
    .replace(/\s*var\.\s*\S+/gi, '')
    .trim();
}

function normalizeSci(name) {
  return cleanSciName(name)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\bspp\.?\b/g, 'spp')
    .trim();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function poolForFamily() {
  if (!selectedSpecies.length) return SPECIES.slice();
  const pool = [];
  selectedSpecies.forEach(i => {
    if (SPECIES[i]) pool.push(SPECIES[i]);
  });
  return pool.length ? pool : SPECIES.slice();
}

function pickQuestions() {
  const pool = poolForFamily();
  if (!pool.length) return [];
  const onlyFlash = selectedModes.length === 1 && selectedModes[0] === 'flash';
  if (onlyFlash && !flashInfinite) return shuffle(pool.slice());
  
  const out = [];
  let bag = shuffle(pool.slice());
  while (out.length < TOTAL && bag.length) out.push(bag.pop());
  if (out.length < TOTAL) {
    bag = shuffle(pool.slice());
    while (out.length < TOTAL) {
      if (!bag.length) bag = shuffle(pool.slice());
      out.push(bag.pop());
    }
  }
  return out;
}

// Data Loader Bootstrap
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
    initSettingsAndControls();
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

// Species / Family Settings Picker
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
      ? 'All species (' + SPECIES.length + ')'
      : selectedSpecies.length + ' species selected';
    updateStartButtonLabel();
    try { localStorage.setItem('dendrologySpeciesSel', JSON.stringify(selectedSpecies)); } catch (e) {}
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

    const head = document.createElement('div');
    head.className = 'family-block-head';

    const famCb = document.createElement('input');
    famCb.type = 'checkbox';
    famCb.className = 'family-cb';
    famCb.dataset.fam = String(f.num);
    famCb.addEventListener('change', () => {
      const set = new Set(selectedSpecies);
      idxs.forEach(i => famCb.checked ? set.add(i) : set.delete(i));
      setSelected([...set]);
    });

    const label = document.createElement('span');
    label.style.flex = '1';
    label.textContent = `${f.num}. ${f.name} (${f.count})`;
    label.style.cursor = 'pointer';
    label.addEventListener('click', () => famCb.click());

    const expand = document.createElement('button');
    expand.type = 'button';
    expand.className = 'family-expand';
    expand.textContent = 'Species';

    const spList = document.createElement('div');
    spList.className = 'family-species-list';

    expand.addEventListener('click', e => {
      e.preventDefault();
      spList.classList.toggle('open');
      expand.textContent = spList.classList.contains('open') ? 'Hide' : 'Species';
    });

    idxs.forEach(si => {
      const pair = SPECIES[si];
      const lab = document.createElement('label');
      lab.className = 'species-check-item';
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.className = 'species-cb';
      cb.dataset.idx = String(si);
      cb.addEventListener('change', () => {
        const set = new Set(selectedSpecies);
        cb.checked ? set.add(si) : set.delete(si);
        setSelected([...set]);
      });
      const span = document.createElement('span');
      span.textContent = `${pair[0]} — ${pair[1]}`;
      lab.appendChild(cb);
      lab.appendChild(span);
      spList.appendChild(lab);
    });

    head.appendChild(famCb);
    head.appendChild(label);
    head.appendChild(expand);
    block.appendChild(head);
    block.appendChild(spList);
    list.appendChild(block);
  });

  document.getElementById('familyAllBtn')?.addEventListener('click', () => setSelected([]));

  // Presets Logic
  const presets = [
    { id: 'quizTest1Toggle', sci: QUIZ_TEST_1_SCI },
    { id: 'quizTest2Toggle', sci: QUIZ_TEST_2_SCI },
    { id: 'quizTest3Toggle', sci: QUIZ_TEST_3_SCI },
    { id: 'quizTest4Toggle', sci: QUIZ_TEST_4_SCI },
    { id: 'quizTest5Toggle', sci: QUIZ_TEST_5_SCI }
  ];

  function applyPresets() {
    let wantSci = new Set();
    presets.forEach(p => {
      const el = document.getElementById(p.id);
      if (el?.checked) p.sci.forEach(s => wantSci.add(s.toLowerCase().trim()));
    });

    if (wantSci.size > 0) {
      const idxs = [];
      SPECIES.forEach((pair, idx) => {
        if (wantSci.has(pair[1].toLowerCase().trim())) idxs.push(idx);
      });
      setSelected(idxs);
    }
  }

  presets.forEach(p => {
    document.getElementById(p.id)?.addEventListener('change', applyPresets);
  });

  updateSummary();
}

function updateStartButtonLabel() {
  const btn = document.getElementById('startBtn');
  if (!btn) return;
  const n = preferredQuizLength || TOTAL || 10;
  const onlyFlash = selectedModes.length === 1 && selectedModes[0] === 'flash';
  const flashN = selectedSpecies.length > 0 ? selectedSpecies.length : SPECIES.length;
  btn.textContent = onlyFlash
    ? (flashInfinite ? 'Study flash cards (infinite)' : `Study ${flashN} flash cards`)
    : `Start ${n}-question quiz`;
}

// Timer & Execution
function updateTimerDisplay() {
  if (!timerText || !timerBar) return;
  timerText.textContent = timeLeft;
  const pct = (timeLeft / TIME_LIMIT) * 100;
  timerBar.style.width = pct + '%';
  timerBar.style.background = timeLeft <= 5 ? 'var(--timer-danger)' : (timeLeft <= 10 ? 'var(--timer-warn)' : 'var(--timer-ok)');
}

function stopTimer() {
  if (timerId) { clearInterval(timerId); timerId = null; }
}

function startTimer() {
  stopTimer();
  timeLeft = TIME_LIMIT;
  answered = false;
  updateTimerDisplay();

  timerId = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      if (!answered) handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  answered = true;
  feedback.textContent = `⏱ Time's up — Correct: ${withPron(currentCorrect)}`;
  feedback.className = 'feedback wrong';
  feedback.classList.remove('hidden');
  streak = 0;
  document.getElementById('streak').textContent = streak;
  if (currentPair) missed.push(currentPair);
  if (isUltimate && currentPair) questions.push(currentPair);
  revealImage();
  showNextBtn();
}

// Identification & Photos (iNaturalist API integration)
function photoBestUrl(ph) {
  if (!ph) return '';
  const u = ph.original_url || ph.large_url || ph.medium_url || ph.url || '';
  return u.replace('/square.', '/large.').replace('/small.', '/large.').replace('/medium.', '/large.');
}

async function fetchIdentifyPhotoPool(sciName) {
  const key = normalizeSci(sciName);
  if (identifyPhotoCache[key]) return identifyPhotoCache[key];

  try {
    const taxRes = await fetch(`https://api.inaturalist.org/v1/taxa?q=${encodeURIComponent(cleanSciName(sciName))}&per_page=5`);
    const taxData = await taxRes.json();
    const taxon = taxData.results?.find(t => normalizeSci(t.name) === key) || taxData.results?.[0];
    if (!taxon) return [];

    const obsRes = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${taxon.id}&photos=true&quality_grade=research&per_page=10`);
    const obsData = await obsRes.json();
    const urls = [];
    obsData.results?.forEach(o => o.photos?.forEach(p => urls.push(photoBestUrl(p))));
    identifyPhotoCache[key] = urls;
    return urls;
  } catch (e) {
    return [];
  }
}

async function loadQuestionPhoto(sciName) {
  if (noPictures) return;
  hideImage();
  imgLoading?.classList.remove('hidden');
  const urls = await fetchIdentifyPhotoPool(sciName);
  imgLoading?.classList.add('hidden');
  if (urls.length && speciesImg) {
    speciesImg.src = urls[0];
    speciesImg.classList.add('loaded');
    if (mode === 'identify' || hintUsedThisQ) revealImage();
  }
}

function hideImage() {
  if (!speciesImg) return;
  speciesImg.classList.remove('revealed', 'loaded');
  speciesImg.removeAttribute('src');
  if (imgPlaceholder) imgPlaceholder.style.opacity = '0.45';
}

function revealImage() {
  if (!speciesImg || noPictures) return;
  speciesImg.classList.add('revealed');
  if (imgPlaceholder) imgPlaceholder.style.opacity = '0';
}

// Question Presentation
function showQuestion() {
  feedback.classList.add('hidden');
  nextBtn.classList.add('hidden');
  optionsEl.innerHTML = '';
  answered = false;
  hintUsedThisQ = false;

  const pair = questions[qIndex];
  currentPair = pair;
  const isSciToCommon = mode === 'sci-to-common';
  currentCorrect = isSciToCommon ? pair[0] : pair[1];

  promptLabel.textContent = isSciToCommon ? 'Scientific name' : 'Common name';
  promptEl.textContent = withPron(isSciToCommon ? pair[1] : pair[0]);

  document.getElementById('qNum').textContent = qIndex + 1;
  document.getElementById('totalQ').textContent = TOTAL;
  progressBar.style.width = ((qIndex / TOTAL) * 100) + '%';

  // Build Options
  const choices = [currentCorrect];
  const pool = SPECIES.map(p => isSciToCommon ? p[0] : p[1]).filter(n => n !== currentCorrect);
  shuffle(pool).slice(0, NUM_CHOICES - 1).forEach(c => choices.push(c));
  
  shuffle(choices).forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.textContent = withPron(opt);
    btn.addEventListener('click', () => selectAnswer(btn, opt));
    optionsEl.appendChild(btn);
  });

  loadQuestionPhoto(pair[1]);
  startTimer();
}

function selectAnswer(btn, chosen) {
  if (answered) return;
  answered = true;
  stopTimer();

  optionsEl.querySelectorAll('.option').forEach(o => o.disabled = true);
  const correct = chosen === currentCorrect;

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
    feedback.textContent = `✗ Wrong — Correct: ${withPron(currentCorrect)}`;
    feedback.className = 'feedback wrong';
  }

  feedback.classList.remove('hidden');
  revealImage();
  showNextBtn();
  document.getElementById('score').textContent = score;
  document.getElementById('streak').textContent = streak;
}

function showNextBtn() {
  nextBtn.classList.remove('hidden');
  nextBtn.textContent = (qIndex + 1 >= questions.length && !isUltimate) ? 'Finish Quiz' : 'Next Question →';
}

function nextQuestion() {
  qIndex++;
  if (qIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

// Global Lifecycle
window.startQuiz = function(ultimateOrGuest) {
  isGuest = ultimateOrGuest === true;
  isUltimate = ultimateOrGuest === 'ultimate';
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

function endQuiz() {
  stopTimer();
  quizScreen.classList.add('hidden');
  stats.classList.add('hidden');
  endScreen.classList.remove('hidden');
  document.body.classList.remove('in-quiz');

  const pct = Math.round((score / TOTAL) * 100) || 0;
  document.getElementById('endMsg').textContent = `Final Score: ${score}/${TOTAL} (${pct}%)`;

  if (!isGuest && playerName !== 'Guest') {
    saveLeaderboardScore(playerName, score, TOTAL, pct);
    renderLeaderboard();
  }
}

function saveLeaderboardScore(name, sc, tot, pct) {
  try {
    const list = JSON.parse(localStorage.getItem('dendrologyLeaderboard') || '[]');
    list.push({ name, score: sc, total: tot, percent: pct, date: new Date().toLocaleDateString() });
    list.sort((a, b) => b.percent - a.percent || b.total - a.total);
    localStorage.setItem('dendrologyLeaderboard', JSON.stringify(list.slice(0, 10)));
  } catch (e) {}
}

function renderLeaderboard() {
  const box = document.getElementById('leaderboardList');
  if (!box) return;
  try {
    const list = JSON.parse(localStorage.getItem('dendrologyLeaderboard') || '[]');
    box.innerHTML = !list.length ? '<span class="lb-empty">No scores recorded yet.</span>' : '';
    list.forEach((entry, idx) => {
      const row = document.createElement('div');
      row.className = 'lb-row';
      row.innerHTML = `<strong>#${idx + 1} ${entry.name}</strong> — ${entry.score}/${entry.total} (${entry.percent}%)`;
      box.appendChild(row);
    });
  } catch (e) {}
}

function initSettingsAndControls() {
  nextBtn?.addEventListener('click', nextQuestion);
  document.getElementById('homeBtn')?.addEventListener('click', () => {
    endScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
  });
  document.getElementById('startOverBtn')?.addEventListener('click', () => window.startQuiz(isUltimate ? 'ultimate' : isGuest));
  document.getElementById('hintBtn')?.addEventListener('click', () => {
    hintUsedThisQ = true;
    revealImage();
  });
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.remove('hidden');
  });
  document.getElementById('closeSettingsBtn')?.addEventListener('click', () => {
    document.getElementById('settingsPanel')?.classList.add('hidden');
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
}

// Start Application on Load
document.addEventListener('DOMContentLoaded', loadDataAndInit);
