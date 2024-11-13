const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const filterSchema = new Schema(
  {
    user: { type: Types.ObjectId, ref: "User", required: true },
    basicDetails: {
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
      languagesSpoken: [
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
      keywords: { type: [String] },
      zipCode: { type: String },
    },
    entertainment: {
      musicGenres: [
        {
          type: String,
          enum: [
            "Blues",
            "Classical",
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
    },
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

    bio: { type: String, trim: true, maxlength: 300 },

    pictures: [{
      audioBio: {
        type: String,
        default: null, // Use null as the default value
        validate: {
          validator: (v) => typeof v === 'string' || v === null,
          message: (props) => `${props.path} must be a string or null.`,
        },
      },
      profilePicture: {
        type: String,
        default: null, // Use null as the default value
        validate: {
          validator: (v) => typeof v === 'string' || v === null,
          message: (props) => `${props.path} must be a string or null.`,
        },
      },
      galleryPics: [{ type: String }],
    }]
  },
  { timestamps: true }
);

const Filter = mongoose.model("Filter", filterSchema);
module.exports = Filter;
