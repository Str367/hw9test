import mongoose from 'mongoose';

export default {
    connect: () => {
         mongoose
            .connect("mongodb://mongo:GlkGmHkud2GMB27NWTHE@containers-us-west-22.railway.app:6934", {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((res) => console.log("mongo db connection created"));
    }
};