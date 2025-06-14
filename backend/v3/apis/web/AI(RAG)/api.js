require("dotenv").config();
const { Pinecone } = require("@pinecone-database/pinecone");
const OpenAI = require("openai");
const { OpenAIEmbeddings } = require("@langchain/openai");
const { loadQAStuffChain } = require("langchain/chains");
const { Document } = require("langchain/document");
const LangchainOpenAI = require("@langchain/openai").OpenAI;

const { model } = require("../../../model/mainModel");
const { regix } = require("../../../helpers/regix");

const AIEndPoints = (app) => {
  app.post("/api/v3/ai2", async (req, res) => {
    try {
      let schedule = [];

      // Collect all schemas
      Object.keys(model).forEach((item) => {
        if (item.includes("Schema")) {
          schedule.push({ [item]: model[item] });
        }
      });

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowser: true,
      });

      const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
      });

      const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 100,
        model: "text-embedding-3-small",
      });

      const indexName = "bauer";
      const index = pc.index(indexName);

      // Embed and upsert only if necessary
      if (schedule.length) {
        const scheduleEmbeddings = await embeddings.embedDocuments(
          schedule.map((item) => JSON.stringify(item))
        );

        console.log("Embeddings length: ", scheduleEmbeddings.length);

        const scheduleVectors = scheduleEmbeddings.map((embedding, i) => ({
          id: `schedule_${i}`,
          values: embedding,
          metadata: { text: JSON.stringify(schedule[i]) },
        }));

        await index.upsert(scheduleVectors);
      }

      // User Query
      // const query =
      //   "create a graph for fuel consumption and prodcution per equipment";
      const { query } = req.body;
      const queryEmbedding = await embeddings.embedQuery(query);

      const queryResponse = await index.query({
        vector: queryEmbedding,
        topK: 5,
        includeMetadata: true,
      });

      const concatenatedText = queryResponse.matches
        .map((match) => match.metadata.text)
        .join(" ");

      console.log("Concatenated Text: ", concatenatedText);

      // Output structure for graph configuration
      const graphSchema = {
        name: "generate_graph_config",
        description:
          "Generates an array of JSON configurations for drawing multiple graphs based on a given schema and query.",
        parameters: {
          type: "object",
          properties: {
            graphs: {
              type: "array",
              description: "An array of graph configurations.",
              items: {
                type: "object",
                properties: {
                  table: {
                    type: "string",
                    description: "Name of the database table or tables",
                  },
                  name: { type: "string", description: "Title of the graph" },
                  X_Axis: { type: "string", description: "X-axis field" },
                  Y_Axis: {
                    type: "array",
                    description: "Y-axis fields",
                    items: {
                      type: "object",
                      properties: {
                        opType: {
                          type: "string",
                          description:
                            "The operation type for the tooltip (e.g., 'Count', 'Sum').",
                          enum: ["Count", "Sum", "Average"],
                        },
                        name: {
                          type: "string",
                          description:
                            "The name of the field to display in the Y_Axis. default value is column name",
                        },
                        col: {
                          type: "string",
                          description:
                            "The Column from which The Y_Axis Draw from table",
                        },
                      },
                    },
                  },
                  graphType: {
                    type: "string",
                    enum: ["Bar", "Line", "Pie"],
                    description: "Type of graph",
                  },
                  top: {
                    type: "string",
                    desription:
                      "the Top Position of the graph in the screen as percentage (e.g: top:10%)",
                  },
                  left: {
                    type: "string",
                    desription:
                      "the Left Position of the graph in the screen as percentage (e.g: left:10%)",
                  },
                  width: {
                    type: "string",
                    desription:
                      "the Width of the graph in the screen as percentage (e.g: width:10%)",
                  },
                  height: {
                    type: "string",
                    desription:
                      "the height of the graph in the screen as percentage (e.g: height:10%)",
                  },
                },
              },
            },
          },
          required: [
            "table",
            "name",
            "X_Axis",
            "Y_Axis",
            "graphType",
            "top",
            "left",
            "width",
            "height",
          ],
        },
      };

      const slicerSchema = {
        name: "generate_slicer_config",
        description:
          "Generates an array of JSON configurations for drawing multiple slicers based on a given schema and query.",
        parameters: {
          type: "object",
          properties: {
            graphs: {
              type: "array",
              description: "An array of graph configurations.",
              items: {
                type: "object",
                properties: {
                  table: {
                    type: "string",
                    description: "Name of the database table or tables",
                  },
                  name: { type: "string", description: "Title of the slicer" },
                  mainSlicer: {
                    type: "string",
                    description: "main slicer field",
                  },
                  subSlicers: {
                    type: "array",
                    description: "sub slicers fields",
                    items: {
                      type: "string",
                    },
                  },
                  slicerType: {
                    type: "string",
                    enum: ["Checks", "Date"],
                    description: "Type of Slicer",
                  },
                  top: {
                    type: "string",
                    desription:
                      "the Top Position of the graph in the screen as percentage (e.g: top:10%)",
                  },
                  left: {
                    type: "string",
                    desription:
                      "the Left Position of the graph in the screen as percentage (e.g: left:10%)",
                  },
                  width: {
                    type: "string",
                    desription:
                      "the Width of the graph in the screen as percentage (e.g: width:10%)",
                  },
                  height: {
                    type: "string",
                    desription:
                      "the height of the graph in the screen as percentage (e.g: height:10%)",
                  },
                },
              },
            },
          },
          required: [
            "table",
            "name",
            "mainSlicer",
            "subSlicers",
            "slicerType",
            "top",
            "left",
            "width",
            "height",
          ],
        },
      };

      const combinedSchema = {
        name: "generate_combined_config",
        description:
          "Generates a JSON configuration containing both graph and slicer settings based on the given schema and query.",
        parameters: {
          type: "object",
          properties: {
            graphs: {
              type: "array",
              description: "An array of graph configurations.",
              items: graphSchema.parameters.properties.graphs.items,
            },
            slicers: {
              type: "array",
              description: "An array of slicer configurations.",
              items: slicerSchema.parameters.properties.graphs.items,
            },
          },
          required: ["graphs", "slicers"],
        },
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content:
              "You are an AI that outputs JSON only.Always format the 'top, left, width, height' property as a percentage (e.g., '10%'). Do not use pixels or any other units. for table u can use 1 table or multiple tables by adding a ',' between them and y-axis can take from multiple tables",
          },
          {
            role: "user",
            content: `Given the following schema, generate a valid JSON graph configuration:
          Schema: ${concatenatedText}
          Query: ${query}`,
          },
        ],
        functions: [combinedSchema],
        function_call: "auto",
        temperature: 0.2,
        top_p: 0.1,
      });

      const responsePayload = response.choices[0]?.message?.function_call
        ?.arguments
        ? JSON.parse(response.choices[0].message.function_call.arguments)
        : {};

      console.log("Graph Configuration: ", responsePayload);

      return res.status(200).json({
        message: queryResponse,
        graphConfig: responsePayload,
      });
    } catch (error) {
      console.error("Error occurred: ", error);
      return res.status(500).json({ message: error.message });
    }
  });
};

module.exports = { AIEndPoints };
