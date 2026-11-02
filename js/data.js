// Pulse Social & Chat Mock Data Repository
// High-fidelity mock data representing creative technologists, UI designers, and indie devs

export const currentUser = {
  id: 'usr_me',
  name: 'Alex Rivera',
  handle: '@alexrivera',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  title: 'Creative Developer & Spatial Designer',
  bio: 'Building interfaces at the intersection of AI, aesthetics & fluid motion ✦ Exploring WebGL & generative UI. Founder @NebulaLab.',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.design',
  joined: 'March 2024',
  stats: {
    following: 348,
    followers: '12.4K',
    posts: 86,
    pulseScore: '98.6'
  }
};

export const initialStories = [
  {
    id: 'story_me',
    userId: 'usr_me',
    userName: 'Your Story',
    userHandle: '@alexrivera',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    hasUnseen: false,
    isSelf: true,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
        caption: 'Late night shaders experimentation 🔮',
        time: '2h ago'
      }
    ]
  },
  {
    id: 'story_1',
    userId: 'usr_1',
    userName: 'Sofia Chen',
    userHandle: '@sofiachen',
    userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        caption: 'Setup upgrade ready for the design sprint ⚡🖥️',
        time: '35m ago'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
        caption: 'Generative typography preview running live!',
        time: '20m ago'
      }
    ]
  },
  {
    id: 'story_2',
    userId: 'usr_2',
    userName: 'Marcus Vance',
    userHandle: '@marcusv',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
        caption: 'Live from Tokyo Creative Tech Summit 🗼✨',
        time: '1h ago'
      }
    ]
  },
  {
    id: 'story_3',
    userId: 'usr_3',
    userName: 'Elena Rostova',
    userHandle: '@elena_motion',
    userAvatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80',
        caption: '3D glass refraction test in Blender Cycles 💎',
        time: '3h ago'
      }
    ]
  },
  {
    id: 'story_4',
    userId: 'usr_4',
    userName: 'Kenji Sato',
    userHandle: '@kenjisato',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    hasUnseen: true,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
        caption: 'Playtesting the new indie combat loop 🎮⚔️',
        time: '4h ago'
      }
    ]
  },
  {
    id: 'story_5',
    userId: 'usr_5',
    userName: 'Aria Sterling',
    userHandle: '@ariasterling',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    hasUnseen: false,
    slides: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
        caption: 'Palette studies for our upcoming design system 🎨',
        time: '8h ago'
      }
    ]
  }
];

export const initialPosts = [
  {
    id: 'post_1',
    author: {
      id: 'usr_1',
      name: 'Sofia Chen',
      handle: '@sofiachen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      badge: 'PRO DESIGNER',
      isFollowing: true
    },
    timestamp: '18m ago',
    tag: 'Design Systems',
    content: `Just rolled out the new fluid glass token architecture for the Nebula Design System! ✦

We ditched hardcoded blur radiuses and switched to dynamic backdrop luminance filters that adapt smoothly whether you're in high-contrast or midnight ambient mode.

Check out the interactive micro-interactions below. Thoughts on the physics curves? 👇`,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16/9'
    },
    codeSnippet: null,
    likes: 246,
    hasLiked: false,
    reposts: 42,
    hasReposted: false,
    bookmarks: 89,
    hasBookmarked: false,
    comments: [
      {
        id: 'c_1',
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        handle: '@alexrivera',
        content: 'The spring dampening feels incredibly tactile! Are you using Framer Motion springs or CSS linear() easing curves?',
        timestamp: '10m ago',
        likes: 12
      },
      {
        id: 'c_2',
        author: 'Sofia Chen',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
        handle: '@sofiachen',
        content: '@alexrivera We built a custom CSS cubic bezier with velocity inheritance. Super lightweight zero JS overhead on render!',
        timestamp: '6m ago',
        likes: 8
      }
    ]
  },
  {
    id: 'post_2',
    author: {
      id: 'usr_2',
      name: 'Marcus Vance',
      handle: '@marcusv',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      badge: 'TECH LEAD',
      isFollowing: true
    },
    timestamp: '1h ago',
    tag: 'Creative Code',
    content: `Quick tip for GPU-accelerated canvas animations in WebGL2:

Never recreate your uniform buffers every frame. Allocate a persistent scratch buffer and stream data with gl.bufferSubData. Gained a 40% framerate stability boost on lower-end devices.

Snippet for reference:`,
    media: null,
    codeSnippet: {
      language: 'javascript',
      code: `// High-performance uniform buffer streaming
const updateDynamicUniforms = (gl, buffer, data) => {
  gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
  gl.bufferSubData(gl.UNIFORM_BUFFER, 0, data);
  gl.bindBuffer(gl.UNIFORM_BUFFER, null);
};`
    },
    likes: 512,
    hasLiked: true,
    reposts: 114,
    hasReposted: false,
    bookmarks: 320,
    hasBookmarked: true,
    comments: [
      {
        id: 'c_3',
        author: 'Elena Rostova',
        avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
        handle: '@elena_motion',
        content: 'This saved my latest WebGL gallery scene from stuttering on mobile Safari! Gold standard tip.',
        timestamp: '45m ago',
        likes: 19
      }
    ]
  },
  {
    id: 'post_3',
    author: {
      id: 'usr_3',
      name: 'Elena Rostova',
      handle: '@elena_motion',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      badge: '3D ARTIST',
      isFollowing: false
    },
    timestamp: '3h ago',
    tag: '3D & Motion',
    content: `Cyberpunk kinetic sphere study — "Echoes of Neo-Kyoto" 🌐

Rendered using raymarching shaders and volumetric bloom. Audio-reactive displacement synced to 128 BPM electronic stems. What color mood speaks to you most: Hyper Neon or Muted Chrome?`,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16/9'
    },
    codeSnippet: null,
    likes: 894,
    hasLiked: false,
    reposts: 187,
    hasReposted: false,
    bookmarks: 245,
    hasBookmarked: false,
    comments: []
  },
  {
    id: 'post_4',
    author: {
      id: 'usr_4',
      name: 'Kenji Sato',
      handle: '@kenjisato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      badge: 'INDIE DEV',
      isFollowing: false
    },
    timestamp: '5h ago',
    tag: 'Indie Game Dev',
    content: `Milestone reached! 🎮 Our sci-fi roguelike just crossed 50,000 wishlist adds on Steam!

Built entirely with a custom lightweight engine. To celebrate, here is a preview of the dynamic neon lighting in the orbital station sector:`,
    media: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
      aspectRatio: '16/9'
    },
    codeSnippet: null,
    likes: 1420,
    hasLiked: true,
    reposts: 310,
    hasReposted: true,
    bookmarks: 412,
    hasBookmarked: false,
    comments: [
      {
        id: 'c_4',
        author: 'Alex Rivera',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        handle: '@alexrivera',
        content: 'Incredible milestone Kenji! The lighting looks so atmospheric. Cant wait for the early access demo.',
        timestamp: '2h ago',
        likes: 15
      }
    ]
  }
];

export const initialChats = [
  {
    id: 'chat_1',
    participant: {
      id: 'usr_1',
      name: 'Sofia Chen',
      handle: '@sofiachen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
      status: 'online',
      role: 'Staff Product Designer',
      bio: 'Crafting fluid design systems & tactile UI'
    },
    unreadCount: 2,
    pinned: true,
    lastActivity: '2m ago',
    messages: [
      {
        id: 'm_1_1',
        senderId: 'usr_1',
        text: 'Hey Alex! Did you get a chance to inspect the new glass tokens on the staging branch?',
        timestamp: '11:15 AM',
        status: 'read'
      },
      {
        id: 'm_1_2',
        senderId: 'usr_me',
        text: 'Yes! The blur falloff feels super crisp. I tested it on both Retina and 144Hz displays, zero lag.',
        timestamp: '11:18 AM',
        status: 'read'
      },
      {
        id: 'm_1_3',
        senderId: 'usr_1',
        text: 'Awesome. Would you be open to doing a quick collaborative review on the chat waveform component?',
        timestamp: '11:24 AM',
        status: 'delivered'
      },
      {
        id: 'm_1_4',
        senderId: 'usr_1',
        text: 'I uploaded the SVG assets and easing presets here 🎨',
        timestamp: '11:25 AM',
        status: 'delivered'
      }
    ],
    // Smart auto-replies for realistic conversation simulation
    autoReplies: [
      "That makes total sense! I'll update the component tokens right away.",
      "Awesome! Let me push a quick commit to the branch so you can test it live.",
      "Love that idea! The micro-interaction feels so much more natural with that easing curve.",
      "Just tested it on mobile view — the layout adjusts beautifully! 🚀",
      "Thanks Alex! Let's sync on the prototype during the team demo."
    ]
  },
  {
    id: 'chat_2',
    participant: {
      id: 'usr_2',
      name: 'Marcus Vance',
      handle: '@marcusv',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      status: 'online',
      role: 'Creative Technologist',
      bio: 'WebGL & Shader wizardry'
    },
    unreadCount: 0,
    pinned: true,
    lastActivity: '42m ago',
    messages: [
      {
        id: 'm_2_1',
        senderId: 'usr_2',
        text: 'Hey man! That shader snippet you shared yesterday solved the uniform buffer memory leak.',
        timestamp: '10:02 AM',
        status: 'read'
      },
      {
        id: 'm_2_2',
        senderId: 'usr_me',
        text: 'Glad it helped! WebGL2 memory management can be tricky when streaming frames.',
        timestamp: '10:05 AM',
        status: 'read'
      },
      {
        id: 'm_2_3',
        senderId: 'usr_2',
        text: 'Let me know whenever you want to test the new WebGPU compute pipeline.',
        timestamp: '10:20 AM',
        status: 'read'
      }
    ],
    autoReplies: [
      "Definitely! WebGPU compute passes are game changers for particle simulations.",
      "I just pushed the repository demo. Check your repo invites!",
      "Sounds like a plan! Let's benchmark the framerates together."
    ]
  },
  {
    id: 'chat_3',
    participant: {
      id: 'usr_3',
      name: 'Elena Rostova',
      handle: '@elena_motion',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
      status: 'offline',
      lastSeen: '1h ago',
      role: '3D Motion Designer',
      bio: 'Rendering impossible physical realities'
    },
    unreadCount: 0,
    pinned: false,
    lastActivity: '3h ago',
    messages: [
      {
        id: 'm_3_1',
        senderId: 'usr_3',
        text: 'Hey Alex, do you have any recommendations for a quick audio reactivity library in vanilla JS?',
        timestamp: '08:45 AM',
        status: 'read'
      },
      {
        id: 'm_3_2',
        senderId: 'usr_me',
        text: 'The native Web Audio AnalyserNode is super fast! You can get frequency data in an 8-bit Uint8Array with virtually zero CPU overhead.',
        timestamp: '09:00 AM',
        status: 'read'
      }
    ],
    autoReplies: [
      "Native Web Audio is perfect. Thanks a ton for the snippet tip!",
      "Working on the next render pass now, will share the 60fps render soon!"
    ]
  },
  {
    id: 'chat_4',
    participant: {
      id: 'usr_4',
      name: 'Kenji Sato',
      handle: '@kenjisato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      status: 'idle',
      lastSeen: '15m ago',
      role: 'Game Director @NeonForge',
      bio: 'Crafting indie cyber worlds'
    },
    unreadCount: 0,
    pinned: false,
    lastActivity: 'Yesterday',
    messages: [
      {
        id: 'm_4_1',
        senderId: 'usr_4',
        text: 'We are sending early beta access keys to select creators next Tuesday. Adding you to the top of the list!',
        timestamp: 'Yesterday',
        status: 'read'
      },
      {
        id: 'm_4_2',
        senderId: 'usr_me',
        text: 'Honored! Cant wait to dive in and stream some gameplay snapshots.',
        timestamp: 'Yesterday',
        status: 'read'
      }
    ],
    autoReplies: [
      "Stoked to hear what you think of the combat flow!",
      "Steam keys are being generated right now!"
    ]
  }
];

export const initialTrends = [
  { tag: '#CreativeCoding', category: 'Technology', postsCount: '48.2K' },
  { tag: '#GenerativeAI', category: 'Artificial Intelligence', postsCount: '124.6K' },
  { tag: '#DesignSystems', category: 'UI/UX Design', postsCount: '19.4K' },
  { tag: '#WebGLShaders', category: 'Computer Graphics', postsCount: '32.1K' },
  { tag: '#IndieGameDev', category: 'Gaming & Dev', postsCount: '87.9K' },
  { tag: '#SpatialComputing', category: 'Vision & Hardware', postsCount: '14.5K' }
];

export const suggestedUsers = [
  {
    id: 'usr_s1',
    name: 'Maya Lin',
    handle: '@mayalin_ux',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    role: 'Design Systems Lead',
    isFollowing: false
  },
  {
    id: 'usr_s2',
    name: 'Devon Thorne',
    handle: '@devontech',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    role: 'Compiler & Graphics Eng',
    isFollowing: false
  },
  {
    id: 'usr_s3',
    name: 'Chloe Monet',
    handle: '@chloemonet',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    role: 'Generative Sound Artist',
    isFollowing: false
  }
];

export const initialNotifications = [
  {
    id: 'notif_1',
    type: 'like',
    user: {
      name: 'Sofia Chen',
      handle: '@sofiachen',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80'
    },
    text: 'liked your post about fluid glass token architecture',
    time: '5m ago',
    read: false
  },
  {
    id: 'notif_2',
    type: 'mention',
    user: {
      name: 'Marcus Vance',
      handle: '@marcusv',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    text: 'mentioned you in a comment: "@alexrivera check this compute shader benchmark"',
    time: '32m ago',
    read: false
  },
  {
    id: 'notif_3',
    type: 'follow',
    user: {
      name: 'Elena Rostova',
      handle: '@elena_motion',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80'
    },
    text: 'started following you',
    time: '2h ago',
    read: true
  },
  {
    id: 'notif_4',
    type: 'repost',
    user: {
      name: 'Kenji Sato',
      handle: '@kenjisato',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
    },
    text: 'reposted your shader optimization note',
    time: '4h ago',
    read: true
  }
];
