import mongoose from "mongoose";

export default {
  connect: () => {
    mongoose
      .connect(
        "mongodb+srv://Str367:Aron55668899@strsclusterforwp.gsdiboi.mongodb.net/?retryWrites=true&w=majority",
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then((res) => console.log("mongo db connection created"));
  },
};
