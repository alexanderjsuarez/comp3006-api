module.exports = mongoose => {
    const Concert = mongoose.model(
      "concert",
      mongoose.Schema(
        {
          name: String,
          location: String,
          genre: String,
          date: Date
        },
        { timestamps: true }
      )
    );
  
    return Concert;
  };