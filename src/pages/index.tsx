import { openai } from "@/libs/openai";
import {
  Button,
  Container,
  Overlay,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";

const useStyles = createStyles((theme) => ({
  hero: {
    position: "relative",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },

  container: {
    height: rem(700),
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    paddingBottom: `calc(${theme.spacing.xl} * 6)`,
    zIndex: 1,
    position: "relative",

    [theme.fn.smallerThan("sm")]: {
      height: rem(500),
      paddingBottom: `calc(${theme.spacing.xl} * 3)`,
    },
  },

  title: {
    color: theme.white,
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(40),
      lineHeight: 1.2,
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(28),
      lineHeight: 1.3,
    },
  },

  description: {
    color: theme.white,
    maxWidth: 600,

    [theme.fn.smallerThan("sm")]: {
      maxWidth: "100%",
      fontSize: theme.fontSizes.sm,
    },
  },

  control: {
    // marginTop: `calc(${theme.spacing.xl} * 1.5)`,

    [theme.fn.smallerThan("sm")]: {
      width: "100%",
    },
  },
}));

export default function Home() {
  const form = useForm({
    initialValues: {
      sqlStatememt: "",
    },
  });

  const convertToBigQuerySql = (prompt: string) =>
    openai
      .createCompletion({
        prompt,
        model: "text-davinci-003",
        temperature: 0.6,
        max_tokens: 100,
        n: 1,
      })
      .then((response) => response.data);

  const buildPrompt = (sql: string) => {
    return `
      You are an expert in SQL.
      Convert the MySQL syntax of ${sql} to BigQuery syntax.
      Please return only SQL syntax.
    `;
  };

  const [convertedSql, setConvertedSql] = useState("");
  const { classes } = useStyles();

  return (
    <>
      <div className={classes.hero}>
        <Overlay
          gradient="linear-gradient(180deg, rgba(0, 0, 0, 0.25) 0%, rgba(0, 0, 0, .65) 40%)"
          opacity={1}
          zIndex={0}
        />
        <Container className={classes.container}>
          <Title className={classes.title}>SQL GPT</Title>
          <Text className={classes.description} size="xl" mt="xl">
            Convert the MySQL syntax to BigQuery syntax.
          </Text>

          <form
          className="w-full"
            onSubmit={form.onSubmit((values) => {
              convertToBigQuerySql(buildPrompt(values.sqlStatememt)).then(
                (res: any) => {
                  setConvertedSql(res.choices[0].text);
                }
              );
            })}
          >
            <div className="flex items-center w-full">
              <TextInput
                placeholder="SELECT * FROM users;"
                className="w-3/5"
                {...form.getInputProps("sqlStatememt")}
              />

              <Button
                type="submit"
                variant="gradient"
                size="xl"
                radius="xl"
                className={classes.control}
              >
                変換
              </Button>
            </div>
            <div className="text-white h-24 font-semibold">
            {convertedSql}
            </div>
          </form>
        </Container>
      </div>
    </>
  );
}
