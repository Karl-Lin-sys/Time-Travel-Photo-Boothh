import { HistoricalEra } from '../types';

export const HISTORICAL_ERAS: HistoricalEra[] = [
  {
    id: 'ancient-egypt',
    name: 'Ancient Egypt',
    year: '1350 BCE',
    category: 'Ancient',
    role: 'Pharaoh & Dynasty Ruler',
    tagline: 'Gilded headdress beside the Great Pyramids & Sphinx at Nile sunset',
    scenePrompt:
      'Insert this exact person\'s face seamlessly into a grand Ancient Egyptian pharaoh royal portrait. The person is dressed in magnificent royal Nemes headdress made of lapis lazuli and hammered gold, wearing an ornate broad collar necklace (usekh) inlaid with carnelian and turquoise, standing regally on an open balcony overlooking the Great Sphinx and Pyramids of Giza at golden hour along the Nile river. Warm dramatic golden sunlight, photorealistic cinematic lighting, maintaining the person\'s facial features, bone structure, and identity with utmost fidelity.',
    iconName: 'Pyramid',
    colorScheme: {
      accent: 'text-amber-400',
      border: 'border-amber-500/40',
      badge: 'bg-amber-950/60 text-amber-300 border-amber-500/30',
    },
  },
  {
    id: 'renaissance-florence',
    name: 'Renaissance Florence',
    year: '1504 CE',
    category: 'Renaissance',
    role: 'Medici Aristocrat & Patron',
    tagline: 'Classic oil painting portrait in Leonardo da Vinci\'s studio',
    scenePrompt:
      'Seamlessly insert this person\'s face into a high Renaissance masterpiece oil portrait in Florence, Italy, painted in the style of Leonardo da Vinci and Titian. The subject wears luxurious crimson velvet doublet with ermine fur trim and fine gold brocade embroidery, seated in a high-arched Tuscan marble villa with views of the Florence Duomo through the stone colonnade. Masterful chiaroscuro lighting, soft sfumato blending, authentic craquelure oil painting texture on ancient canvas, strictly preserving the exact facial geometry and eyes of the person.',
    iconName: 'Palette',
    colorScheme: {
      accent: 'text-rose-400',
      border: 'border-rose-500/40',
      badge: 'bg-rose-950/60 text-rose-300 border-rose-500/30',
    },
  },
  {
    id: 'roaring-twenties',
    name: 'Roaring Twenties',
    year: '1925 CE',
    category: 'Modern',
    role: 'Jazz Age Gatsby Socialite',
    tagline: 'Art Deco speakeasy lounge with brass saxophone & champagne',
    scenePrompt:
      'Insert this person\'s face into an authentic 1920s Art Deco jazz club speakeasy scene in Paris or New York. The person is impeccably styled: tailored 1920s tuxedo with silk lapels or sparkling beaded flapper attire with feathered headpiece and pearl necklace, holding a vintage champagne coupe. Background features warm dim amber club lighting, saxophone players, geometric Art Deco gilded wall reliefs, and soft atmospheric smoke haze. High resolution photographic portrait with subtle 1920s vintage 35mm film grain, preserving the subject\'s clear facial identity and natural expression.',
    iconName: 'Sparkles',
    colorScheme: {
      accent: 'text-yellow-400',
      border: 'border-yellow-500/40',
      badge: 'bg-yellow-950/60 text-yellow-300 border-yellow-500/30',
    },
  },
  {
    id: 'victorian-london',
    name: 'Victorian London',
    year: '1888 CE',
    category: 'Modern',
    role: 'Gothic Detective & Aristocrat',
    tagline: 'Gaslit cobblestone streets of Baker Street under misty moonlight',
    scenePrompt:
      'Seamlessly insert this person\'s face into an authentic 1880s Victorian London atmospheric portrait. The person is dressed in fine tailored dark wool Inverness cape coat, silk cravat, high collar, holding a brass pocket watch or ornate walking cane. In the background, gas lanterns glow through the thick London fog on wet cobblestone streets, with vintage horse-drawn carriages and Victorian iron lamp posts. Rich cinematic sepia and cool moonlight dual-tone photography with 19th-century wet plate collodion photographic grain, retaining the person\'s face and expression perfectly.',
    iconName: 'PocketWatch',
    colorScheme: {
      accent: 'text-cyan-400',
      border: 'border-cyan-500/40',
      badge: 'bg-cyan-950/60 text-cyan-300 border-cyan-500/30',
    },
  },
  {
    id: 'feudal-japan',
    name: 'Feudal Japan',
    year: '1603 CE',
    category: 'Medieval',
    role: 'Edo Period Samurai Commander',
    tagline: 'Lacquered armor & cherry blossoms before Himeji Castle',
    scenePrompt:
      'Seamlessly insert this person\'s face into a dignified Feudal Japanese Edo Period Samurai lord or commander portrait. Dressed in masterfully crafted black and vermilion lacquered samurai armor (o-yoroi) with silk cord lacing and a katana scabbard at the sash, standing on the balcony of a hilltop castle surrounded by blooming pink cherry blossom trees (sakura) with Mount Fuji in the distant mist. Dramatic soft sunrise lighting, historic ukiyo-e and cinematic film blend, perfectly preserving the person\'s facial features and eyes.',
    iconName: 'Shield',
    colorScheme: {
      accent: 'text-red-400',
      border: 'border-red-500/40',
      badge: 'bg-red-950/60 text-red-300 border-red-500/30',
    },
  },
  {
    id: 'apollo-moon-landing',
    name: 'Apollo 11 Moon Landing',
    year: '1969 CE',
    category: 'Modern',
    role: 'NASA Lunar Astronaut',
    tagline: 'On the Sea of Tranquility with Earth rising in the black sky',
    scenePrompt:
      'Seamlessly insert this person\'s face into an iconic 1969 NASA Apollo moon landing photograph. The person is wearing an authentic vintage Apollo A7L spacesuit with lunar mission patches. The helmet gold visor is lifted up or transparent, clearly displaying the person\'s face with realistic lunar sunlight reflection and slight sweat or awe. In the background, the desolate gray cratered lunar dust surface stretches out, with the Lunar Module and the brilliant blue Earth suspended in the pitch-black void of space. Authentic 70mm Hasselblad film look with vintage color tones, keeping the person\'s facial features unmistakably accurate.',
    iconName: 'Rocket',
    colorScheme: {
      accent: 'text-blue-400',
      border: 'border-blue-500/40',
      badge: 'bg-blue-950/60 text-blue-300 border-blue-500/30',
    },
  },
  {
    id: 'medieval-knight',
    name: 'High Medieval Castle',
    year: '1240 CE',
    category: 'Medieval',
    role: 'Knight Commander & Champion',
    tagline: 'Polished steel plate armor inside a torchlit banquet hall',
    scenePrompt:
      'Insert this person\'s face seamlessly into a 13th-century High Medieval champion knight portrait. Wearing etched steel plate armor with engraved heraldic lion insignias and a heavy royal blue velvet cloak fastened with a bronze brooch. Seated in a grand stone castle great hall illuminated by blazing hearth fires and iron chandelier candlelight, with tapestries hanging from ancient vaulted stone arches. Painterly yet photorealistic realism, preserving the person\'s facial structure, eyes, and expression with total accuracy.',
    iconName: 'Sword',
    colorScheme: {
      accent: 'text-emerald-400',
      border: 'border-emerald-500/40',
      badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30',
    },
  },
  {
    id: 'wild-west',
    name: 'American Wild West',
    year: '1882 CE',
    category: 'Modern',
    role: 'Frontier Sheriff & Gunslinger',
    tagline: 'Dusty timber boardwalk in front of a rustic saloon at high noon',
    scenePrompt:
      'Seamlessly insert this person\'s face into a gritty, iconic 1880s American Wild West frontier portrait. Dressed in a distressed brown leather duster coat, weathered cowboy hat, silver star sheriff badge pinned to a woolen vest, and bandana neckerchief. The background shows a sun-drenched dusty western frontier boomtown wooden street with hitching posts, saloon swinging doors, and red rock desert buttes under harsh desert sunlight. Authentic tintype daguerreotype photography warmth, crisp facial fidelity matching the person\'s likeness.',
    iconName: 'Compass',
    colorScheme: {
      accent: 'text-amber-500',
      border: 'border-amber-600/40',
      badge: 'bg-amber-950/70 text-amber-200 border-amber-600/30',
    },
  },
  {
    id: 'studio-54-disco',
    name: '1970s Disco Era',
    year: '1977 CE',
    category: 'Modern',
    role: 'Studio 54 Disco Icon',
    tagline: 'Neon dance floor with shimmering mirror balls & oversized sunglasses',
    scenePrompt:
      'Insert this person\'s face into a high-energy 1977 Studio 54 New York disco nightlife photo. The person wears an outrageous shimmering satin or metallic disco jumpsuit, platform shoes, and tinted aviator glasses, dancing under giant spinning faceted disco balls casting pinpoints of light across the crowded illuminated neon dance floor. Authentic vintage Kodak color film flash photography with rich saturation, light leaks, and warm halation, faithfully retaining the person\'s face and radiant smile.',
    iconName: 'Music',
    colorScheme: {
      accent: 'text-fuchsia-400',
      border: 'border-fuchsia-500/40',
      badge: 'bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-500/30',
    },
  },
  {
    id: 'cyberpunk-2150',
    name: 'Neo-Tokyo 2150',
    year: '2150 CE',
    category: 'Future',
    role: 'Cybernetic Time Agent',
    tagline: 'Holographic neon sky-city with cyber-optics and hovering spinners',
    scenePrompt:
      'Insert this person\'s face into a futuristic cyberpunk metropolis in the year 2150. The person has subtle elegant cybernetic temple implants with pulsing cyan LED fiber optics, wearing a sleek matte-black nanoweave carbon fiber coat with high glowing collar. Standing on a rain-slicked neon skyscraper skydeck overlooking colossal holographic advertisements, streaming vertical traffic lanes of flying vehicles, and magenta and cyan rain reflections. Cinematic Blade Runner aesthetic, ultra-detailed skin textures maintaining the exact identity of the person.',
    iconName: 'Zap',
    colorScheme: {
      accent: 'text-teal-400',
      border: 'border-teal-500/40',
      badge: 'bg-teal-950/60 text-teal-300 border-teal-500/30',
    },
  },
];

export const SAMPLE_AVATARS = [
  {
    id: 'avatar-1',
    name: 'Elena (Warm Smile)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
    description: 'Natural light portrait, direct eye contact',
  },
  {
    id: 'avatar-2',
    name: 'Marcus (Thoughtful)',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    description: 'Clean studio portrait, sharp jawline',
  },
  {
    id: 'avatar-3',
    name: 'Amina (Regal Focus)',
    url: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&auto=format&fit=crop&q=80',
    description: 'Expressive eyes, high-contrast portrait',
  },
  {
    id: 'avatar-4',
    name: 'David (Confident)',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    description: 'Casual lighting, direct friendly gaze',
  },
];
