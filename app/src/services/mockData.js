const mockUserData = {
  banner: "https://pbs.twimg.com/profile_banners/44196397/1739948056/1080x360",
  profilePicture:
    "https://pbs.twimg.com/profile_images/1683364031921356800/lC0xkPJZ_400x400.jpg",
  name: "Elon Musk",
  username: "elonmusk",
  bio: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, provident sit? Laudantium dicta voluptatum dolor",
  joined: "June 2009",
  following: 1083,
  followers: 210,
};

const mockTweetsData = [
  {
    id: 1,
    user: {
      name: "Toto",
      username: "toto",
      profilePicture:
        "https://i.ytimg.com/vi/yIxEc2Phlr4/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDuWqZadkIk6w34h5NcicrLyhlRPg",
    },
    text: "lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, provident sit? Laudantium dicta voluptatum dolor",
    image:
      "https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?cs=srgb&dl=pexels-pixabay-104827.jpg&fm=jpg",
    timestamp: "11/03/2025",
  },
  {
    id: 2,
    user: {
      name: "Elon Musk",
      username: "elonmusk",
      profilePicture:
        "https://pbs.twimg.com/profile_images/1683364031921356800/lC0xkPJZ_400x400.jpg",
    },
    text: "lorem ipsum dolor sit amet",
    image: "",
    timestamp: "11/03/2025",
  },
  {
    id: 3,
    user: {
      name: "Pikachu",
      username: "pikachu",
      profilePicture:
        "https://i.scdn.co/image/ab67616d0000b273cfeae645958e9248abff0710",
    },
    text: "lorem ipsum dolor sit amet",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQk-Iw3lq3veMt9HPIm9XpwrAk9_i2dbzo6gA&s",
    timestamp: "11/03/2025",
  },
  {
    id: 4,
    user: {
      name: "Mark Zuckerberg",
      username: "zuck",
      profilePicture:
        "https://www.decideurs-magazine.com/images/zuckerbergwoke.jpg",
    },
    text: "Meta is working on something amazing! Stay tuned.",
    image:
      "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    timestamp: "11/03/2025",
  },
  {
    id: 5,
    user: {
      name: "Bill Gates",
      username: "BillGates",
      profilePicture:
        "https://ted-conferences-speaker-photos-production.s3.amazonaws.com/yoa4pm3vyerco6hqbhjxly3bf41d",
    },
    text: "Climate change is real. Let's take action now!",
    image: "",
    timestamp: "11/03/2025",
  },
];

const mockNotifications = [
  {
    id: 1,
    text: "Votre tweet a reçu un nouveau like.",
    type: "like",
    timestamp: "Il y a 1 heure",
  },
  {
    id: 2,
    text: "Votre tweet a reçu un nouveau like !",
    type: "like",
    timestamp: "Il y a 2 heures",
  },
  {
    id: 3,
    text: "Vous avez été mentionné dans un tweet.",
    type: "mention",
    timestamp: "Il y a 3 heures",
  },
];

export default { mockUserData, mockTweetsData, mockNotifications };
