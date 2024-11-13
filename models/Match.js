const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    matchPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    filters: {
      religion: [
        {
          type: String,
          enum: [
            "Agnostic",
            "Atheist",
            "Christianity",
            "Islam",
            "Nonreligious",
            "Other",
            "Spiritual",
          ],
        },
      ],
      education: [
        {
          type: String,
          enum: [
            "Associate’s degree",
            "Autodidactic in Specialized Area",
            "Bachelor’s degree",
            "Doctoral degree",
            "High school",
            "Master’s degree",
            "Middle school",
            "Some college",
          ],
        },
      ],
      languages: [
        {
          type: String,
          enum: [
            "Egyptian Arabic",
            "English",
            "French",
            "Haitian Creole",
            "Italian",
            "Jamaican/Patois/Patwa",
            "Japanese",
            "Korean",
            "Mandarin Chinese",
            "Other",
            "Russian",
            "Spanish",
            "Vietnamese",
          ],
        },
      ],
      distance: { type: Number }, // Distance in kilometers for matching
      financialStability: {
        netWorth: { type: Number },
        annualIncome: { type: Number },
        creditScore: { type: Number },
      },
      travel: {
        transportation: [
          {
            type: String,
            enum: [
              "Have No Major Transportation",
              "Have Car(s)",
              "Have Truck(s)",
              "Have Boat(s)",
              "Have Aircraft(s)",
            ],
          },
        ],
        passport: [
          {
            type: String,
            enum: [
              "No passport",
              "Applied for Passport",
              "Have Passport",
              "Intend to get Passport",
            ],
          },
        ],
      },
      musicGenres: [
        {
          type: String,
          enum: [
            "Blues",
            "Classical",
            "Country",
            "EDM",
            "Electronic/Dance",
            "Folk",
            "Funk",
            "Gospel",
            "Hip-hop/Rap",
            "House",
            "Jazz",
            "Latin",
            "Metal",
            "Pop",
            "Punk",
            "R&B",
            "Reggae",
            "Rock",
            "Soul",
            "Techno",
          ],
        },
      ],
      movieGenres: [
        {
          type: String,
          enum: [
            "Action",
            "Adventure",
            "Animation",
            "Biographical",
            "Comedy",
            "Crime",
            "Documentary",
            "Drama",
            "Family",
            "Fantasy",
            "Historical",
            "Horror",
            "Martial Arts",
            "Musical",
            "Mystery",
            "Romance",
            "Science Fiction",
            "Sports",
            "Spy/Espionage",
            "Superhero",
            "Supernatural/Paranormal",
            "Thriller",
            "War",
            "Western",
          ],
        },
      ],
      household: {
        residingStatus: [
          {
            type: String,
            enum: ["Buying", "Renting", "Owned", "Contributing", "Temp stay"],
          },
        ],
        adultsInHouse: [
          {
            type: String,
            enum: [
              "Live alone",
              "Live with adult(s)",
              "Roommate",
              "Taking care of Parent(s)",
            ],
          },
        ],
        numAdults: { type: Number },
        children: [
          {
            type: String,
            enum: [
              "No children",
              "Have infant(s)",
              "Have pre-teen(s)",
              "Have teenager(s)",
              "Have grown children",
            ],
          },
        ],
        numChildren: { type: Number },
        indoorPets: [
          {
            type: String,
            enum: [
              "None",
              "Have dog(s)",
              "Have cat(s)",
              "Have bird(s)",
              "Have reptile(s)",
              "Have rodent(s)",
            ],
          },
        ],
        outdoorPets: [
          {
            type: String,
            enum: [
              "None",
              "Have dog(s)",
              "Have cat(s)",
              "Have bird(s)",
              "Have reptile(s)",
              "Have rodent(s)",
            ],
          },
        ],
        numPets: { type: Number },
      },
      humanDesign: {
        gender: [
          {
            type: String,
            enum: [
              "Natural Male",
              "Natural Female",
              "Trans Female",
              "Trans Male",
            ],
          },
        ],
        race: [
          {
            type: String,
            enum: [
              "African/Black",
              "Asian",
              "Caucasian/White",
              "Hispanic/Latino",
              "Mixed/Multiracial",
              "Native American/Indigenous",
              "Other",
              "Pacific Islander",
            ],
          },
        ],
        skinTone: [{ type: String }],
        age: { type: Number },
        height: { type: Number },
        weight: { type: Number },
        bodyType: [
          {
            type: String,
            enum: [
              "Slim",
              "Overweight",
              "Curvy",
              "Athletic",
              "Muscular",
              "Average",
            ],
          },
        ],
        sexualOrientation: [
          {
            type: String,
            enum: [
              "Straight",
              "Gay",
              "Lesbian",
              "Bisexual",
              "Pansexual",
              "Asexual",
              "Sapiosexual",
            ],
          },
        ],
      },
      relationshipAndHealth: {
        relationshipStatus: [
          {
            type: String,
            enum: [
              "Single",
              "Poly",
              "Cheating",
              "Married",
              "Divorced",
              "Widowed",
              "Separated",
            ],
          },
        ],
        relationshipGoals: [
          {
            type: String,
            enum: [
              "Casual Dating",
              "Polyamory",
              "Marriage",
              "Friendship",
              "Monogamous Relationship",
              "Friends with Benefits",
              "Long-term Relationship",
              "Experimental Relationship",
              "Hook-ups",
              "Networking Opportunities",
              "Open Relationship",
            ],
          },
        ],
        alcoholUse: {
          type: String,
          enum: [
            "No Alcohol use",
            "Alcohol occasionally",
            "Alcohol rarely",
            "Alcohol at least 3 times weekly",
          ],
        },
        cannabisUse: {
          type: String,
          enum: [
            "No CBD use",
            "CBD products occasionally",
            "CBD rarely",
            "CBD at least 3 times weekly",
            "CBD medically",
          ],
        },
        otherDrugUse: {
          type: String,
          enum: [
            "No Other Drug use",
            "Other Drug use occasionally",
            "Other Drug use rarely",
            "Other Drug use at least 3 times weekly",
          ],
        },
      },
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    matchCreatedAt: {
      type: Date,
      default: Date.now,
    },
    matchRejectedAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
    },

    distanceBetweenUsers: { type: Number },

    isMutualMatch: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

matchSchema.methods.acceptMatch = function () {
  this.status = "accepted";
  this.matchAcceptedAt = Date.now();
  this.isMutualMatch = true;
};

matchSchema.methods.rejectMatch = function () {
  this.status = "rejected";
  this.matchRejectedAt = Date.now();
};

const Match = mongoose.model("Match", matchSchema);
module.exports = Match;
