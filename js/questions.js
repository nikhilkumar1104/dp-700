window.DP700_QUESTION_BANK = [
  {
    "id": "DP7U-0001",
    "domain": "Ingest and transform data",
    "topic": "PySpark joins",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A 4.2-TB sales DataFrame is joined to a 7-MB currency lookup. The physical plan shows a SortMergeJoin and shuffles both inputs. Which change is the most direct fix?",
    "code": "result = sales.join(currency, \"CurrencyCode\", \"left\")",
    "explanation": "Broadcasting the small lookup avoids shuffling the large fact DataFrame.",
    "options": [
      "Wrap currency with broadcast() before the join",
      "Cache sales after the join",
      "Coalesce sales to one partition",
      "Collect currency and sales to the driver"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0002",
    "domain": "Monitor and optimize",
    "topic": "Spark skew",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "One AccountId represents 41% of the rows in a 1.8-TB join. Two tasks run for 35 minutes while the others finish in under a minute. Which two actions directly target this skew?",
    "code": "",
    "explanation": "AQE can split skewed partitions, and salting distributes the hot key across partitions.",
    "options": [
      "Enable Adaptive Query Execution skew-join handling",
      "Salt the hot AccountId and adjust the join",
      "Cache the final joined DataFrame only",
      "Increase the semantic model refresh frequency",
      "Run VACUUM on the source Delta table"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0003",
    "domain": "Ingest and transform data",
    "topic": "PySpark windows",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the code to keep the most recently modified row for each PolicyNumber.",
    "code": "from pyspark.sql import Window\nfrom pyspark.sql.functions import [1], col\n\nw = Window.[2](\"PolicyNumber\").orderBy(col(\"ModifiedAt\").desc(), col(\"SourcePriority\").desc())\nlatest = policies.withColumn(\"rn\", [1]().over(w)).filter(col(\"rn\") == [3]).drop(\"rn\")",
    "explanation": "row_number over a partitioned window creates one deterministic latest row per policy.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "row_number",
          "dense_rank",
          "count",
          "lead"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "partitionBy",
          "groupBy",
          "repartition",
          "orderBy"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "1",
          "0",
          "-1",
          "null"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0004",
    "domain": "Ingest and transform data",
    "topic": "PySpark joins",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "After joining Orders and Customers, both inputs contain a column named Status. A later select(\"Status\") fails. What should you do?",
    "code": "o = orders.alias(\"o\")\nc = customers.alias(\"c\")\njoined = o.join(c, col(\"o.CustomerID\") == col(\"c.CustomerID\"))",
    "explanation": "The error is schema ambiguity, resolved by qualifying or renaming the duplicate column.",
    "options": [
      "Select a qualified column such as col(\"o.Status\") or rename before joining",
      "Increase executor memory",
      "Convert both DataFrames to CSV",
      "Run OPTIMIZE on both tables"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0005",
    "domain": "Ingest and transform data",
    "topic": "PySpark schema",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the union so that a newly added optional column in the second DataFrame does not fail the operation.",
    "code": "combined = january.[1](february, [2]=[3])",
    "explanation": "unionByName with allowMissingColumns=True aligns names and fills absent columns with null.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "unionByName",
          "union",
          "join",
          "merge"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "allowMissingColumns",
          "ignoreSchema",
          "mergeSchema",
          "enforceSchema"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "True",
          "False",
          "None",
          "\"auto\""
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0006",
    "domain": "Monitor and optimize",
    "topic": "Spark partitions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A DataFrame has 3,000 tiny partitions after a narrow filter and will be written once to 24 output files. Which transformation is generally appropriate before the write?",
    "code": "",
    "explanation": "coalesce reduces partitions without a full shuffle when reducing partition count.",
    "options": [
      "coalesce(24)",
      "repartition(1)",
      "collect()",
      "cache()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0007",
    "domain": "Monitor and optimize",
    "topic": "Spark partitions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A 900-GB DataFrame currently has 8 partitions and must be evenly redistributed across 240 executors before a large aggregation. Which operation is appropriate?",
    "code": "",
    "explanation": "repartition can increase partitions and performs a shuffle to redistribute data evenly.",
    "options": [
      "repartition(240)",
      "coalesce(240)",
      "take(240)",
      "persist(StorageLevel.DISK_ONLY)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0008",
    "domain": "Monitor and optimize",
    "topic": "Spark caching",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "An expensive normalized DataFrame is reused by six actions in one notebook. Which two actions are appropriate?",
    "code": "",
    "explanation": "Persist avoids recomputation; unpersist releases executor storage after reuse.",
    "options": [
      "Persist the normalized DataFrame before reuse",
      "Unpersist it after the final action",
      "Collect all rows to the driver",
      "Coalesce it to one partition regardless of size",
      "Run VACUUM before each action"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0009",
    "domain": "Ingest and transform data",
    "topic": "PySpark JSON",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the code to parse a JSON string column and extract a nested decimal amount.",
    "code": "from pyspark.sql.functions import [1], col\nfrom pyspark.sql.types import StructType, StructField, StructType, DecimalType\n\nschema = StructType([StructField(\"payment\", StructType([StructField(\"amount\", DecimalType(18,2))]))])\nparsed = raw.withColumn(\"j\", [1](col(\"Payload\"), [2])) \\\n            .withColumn(\"Amount\", col(\"j.payment.amount\")) \\\n            .[3](\"j\")",
    "explanation": "from_json uses an explicit schema; the temporary parsed struct can then be dropped.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "from_json",
          "to_json",
          "get_json_object",
          "parse_url"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "schema",
          "\"schema\"",
          "inferSchema",
          "None"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "drop",
          "select",
          "filter",
          "distinct"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0010",
    "domain": "Ingest and transform data",
    "topic": "PySpark arrays",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Each order row contains an Items array. You need one output row per item while retaining orders whose Items array is null. Which function is best?",
    "code": "",
    "explanation": "explode_outer preserves the source row when the array is null or empty.",
    "options": [
      "explode_outer",
      "explode",
      "flatten",
      "array_distinct"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0011",
    "domain": "Ingest and transform data",
    "topic": "PySpark deduplication",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need deterministic deduplication by InvoiceId, preferring the latest UpdatedAt and then the highest IngestionSequence. Why is dropDuplicates([\"InvoiceId\"]) insufficient?",
    "code": "",
    "explanation": "dropDuplicates does not express deterministic precedence among duplicates; a window is required.",
    "options": [
      "It does not define which duplicate row is retained",
      "It cannot operate on string keys",
      "It always sorts descending",
      "It requires a broadcast join"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0012",
    "domain": "Ingest and transform data",
    "topic": "PySpark joins",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need all source customer keys that do not yet exist in the target dimension, without returning target columns. Which join type is best?",
    "code": "",
    "explanation": "A left anti join returns only left-side rows with no match on the right.",
    "options": [
      "left_anti",
      "left_semi",
      "inner",
      "full_outer"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0013",
    "domain": "Ingest and transform data",
    "topic": "PySpark joins",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need source rows whose BusinessKey exists in a small approved-key table, but you do not need any columns from the approved-key table. Which join type is most appropriate?",
    "code": "",
    "explanation": "A left semi join filters the left side to matching keys without adding right-side columns.",
    "options": [
      "left_semi",
      "left_anti",
      "right_outer",
      "cross"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0014",
    "domain": "Monitor and optimize",
    "topic": "Spark UDF performance",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Python UDF lowercases and trims a string column across 2 billion rows. Which rewrite is most likely to improve performance?",
    "code": "clean = df.withColumn(\"Normalized\", normalize_udf(col(\"Name\")))",
    "explanation": "Built-in Spark SQL functions can be optimized and avoid Python serialization overhead.",
    "options": [
      "Replace the Python UDF with built-in lower(trim(col(\"Name\")))",
      "Cache the UDF object",
      "Collect the Name column first",
      "Convert the table to JSON"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0015",
    "domain": "Monitor and optimize",
    "topic": "Spark predicate pushdown",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A notebook reads a Parquet folder and immediately filters OrderDate. Which design best supports predicate pushdown?",
    "code": "",
    "explanation": "Native filters close to the scan can be pushed to the data source and reduce I/O.",
    "options": [
      "Apply the column filter before wide transformations and avoid wrapping it in an opaque Python UDF",
      "Collect rows and filter in Python",
      "Convert OrderDate to a Python list",
      "Use a cross join before filtering"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0016",
    "domain": "Monitor and optimize",
    "topic": "Spark partition pruning",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Delta table is partitioned by OrderYear and OrderMonth. Which filter is most likely to prune partitions?",
    "code": "",
    "explanation": "Direct predicates on partition columns allow Spark to avoid unrelated partitions.",
    "options": [
      "(col(\"OrderYear\") == 2026) & (col(\"OrderMonth\") == 7)",
      "year(col(\"OrderDate\")) == 2026 inside a Python UDF",
      "col(\"CustomerName\").contains(\"2026\")",
      "rand() > 0.5"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0017",
    "domain": "Ingest and transform data",
    "topic": "PySpark null handling",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the code to replace null quantities with zero and discard rows whose BusinessKey is null.",
    "code": "clean = raw.[1]({\"Quantity\": [2]}).[3](subset=[\"BusinessKey\"])",
    "explanation": "fillna replaces Quantity nulls; dropna with subset removes rows missing the required key.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "fillna",
          "dropna",
          "replace",
          "na"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "0",
          "None",
          "\"0\"",
          "False"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "dropna",
          "fillna",
          "distinct",
          "cache"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0018",
    "domain": "Ingest and transform data",
    "topic": "PySpark aggregation",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the code to calculate distinct active customers and total net revenue by region.",
    "code": "from pyspark.sql.functions import [1], [2], col\nsummary = sales.filter(col(\"IsActive\") == True).groupBy(\"Region\").agg(\n    [1](\"CustomerID\").alias(\"ActiveCustomers\"),\n    [2](\"NetRevenue\").alias(\"Revenue\")\n)",
    "explanation": "countDistinct counts unique customers and sum aggregates net revenue.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "countDistinct",
          "count",
          "approx_count_distinct",
          "collect_set"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "sum",
          "avg",
          "max",
          "first"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0019",
    "domain": "Monitor and optimize",
    "topic": "Spark approximate aggregation",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A dashboard needs an approximate distinct device count over tens of billions of events, and a small estimation error is acceptable. Which function is appropriate?",
    "code": "",
    "explanation": "approx_count_distinct reduces memory and compute for large-cardinality estimates.",
    "options": [
      "approx_count_distinct",
      "countDistinct",
      "collect_set followed by size",
      "row_number"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0020",
    "domain": "Ingest and transform data",
    "topic": "PySpark timestamps",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the conversion of an ISO timestamp string to timestamp and derive the event date.",
    "code": "from pyspark.sql.functions import [1], [2], col\nx = events.withColumn(\"EventTs\", [1](col(\"EventTime\"))) \\\n          .withColumn(\"EventDate\", [2](col(\"EventTs\")))",
    "explanation": "to_timestamp parses the string and to_date derives the calendar date.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "to_timestamp",
          "to_date",
          "unix_timestamp",
          "date_format"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "to_date",
          "to_timestamp",
          "current_date",
          "lit"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0021",
    "domain": "Ingest and transform data",
    "topic": "PySpark strings",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You must create a stable normalized business key from CountryCode and AccountNumber while avoiding accidental collisions such as AB+C and A+BC. What is the better design?",
    "code": "",
    "explanation": "Delimited, normalized input prevents ambiguous concatenations before hashing.",
    "options": [
      "Use concat_ws with an unambiguous delimiter and normalize data types before hashing",
      "Concatenate raw strings with no delimiter",
      "Use monotonically_increasing_id as the business key",
      "Use rand() for each row"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0022",
    "domain": "Ingest and transform data",
    "topic": "PySpark hashing",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the row-hash expression used to detect changes across three nullable columns.",
    "code": "from pyspark.sql.functions import [1], [2], coalesce, col, lit\nrow_hash = [1]([2](\"||\", coalesce(col(\"Name\"),lit(\"\")), coalesce(col(\"City\"),lit(\"\")), coalesce(col(\"Tier\").cast(\"string\"),lit(\"\"))), 256)",
    "explanation": "concat_ws builds a canonical string and sha2(...,256) produces a stable change-detection hash.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "sha2",
          "md5",
          "hash",
          "crc32"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "concat_ws",
          "concat",
          "format_string",
          "array_join"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0023",
    "domain": "Ingest and transform data",
    "topic": "Delta merge with PySpark",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the Delta merge to update changed rows and insert new rows.",
    "code": "from delta.tables import DeltaTable\n\nt = DeltaTable.forName(spark, \"silver.customer\")\n(t.alias(\"t\").[1](source.alias(\"s\"), \"t.CustomerID = s.CustomerID\")\n .[2](condition=\"t.RowHash <> s.RowHash\", set={\"Name\":\"s.Name\",\"RowHash\":\"s.RowHash\"})\n .[3](values={\"CustomerID\":\"s.CustomerID\",\"Name\":\"s.Name\",\"RowHash\":\"s.RowHash\"})\n .execute())",
    "explanation": "DeltaTable.merge combines a matched update rule with a not-matched insert rule.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "merge",
          "join",
          "update",
          "upsert"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "whenMatchedUpdate",
          "whenMatchedDelete",
          "whenNotMatchedInsert",
          "whenMatchedUpdateAll"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "whenNotMatchedInsert",
          "whenMatchedUpdate",
          "whenNotMatchedBySourceDelete",
          "insertInto"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0024",
    "domain": "Monitor and optimize",
    "topic": "Spark explain plan",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to verify whether Spark selected a BroadcastHashJoin and whether filters were pushed to the scan. Which action is most useful?",
    "code": "",
    "explanation": "The formatted physical plan and Spark UI expose join strategy, exchanges, scans, and pushed filters.",
    "options": [
      "Inspect df.explain(\"formatted\") and the Spark UI SQL plan",
      "Count the rows in the source manually",
      "Rename the notebook",
      "Run VACUUM with zero retention"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0025",
    "domain": "Monitor and optimize",
    "topic": "Spark actions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which line is most dangerous when df contains 600 million rows?",
    "code": "",
    "explanation": "collect transfers every row to the driver and can exhaust driver memory.",
    "options": [
      "rows = df.collect()",
      "sample = df.limit(20)",
      "count = df.count()",
      "schema = df.schema"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0026",
    "domain": "Monitor and optimize",
    "topic": "Spark driver memory",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A developer calls toPandas() on a 120-GB DataFrame and the notebook driver crashes. What is the root cause?",
    "code": "",
    "explanation": "toPandas collects the full result to the driver process.",
    "options": [
      "toPandas materializes all selected data in driver memory",
      "toPandas forces a broadcast join",
      "toPandas runs VACUUM",
      "toPandas disables Delta transactions"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0027",
    "domain": "Ingest and transform data",
    "topic": "PySpark ordering",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need deterministic ordering only within each existing partition before writing, without a global shuffle-based sort. Which method should you use?",
    "code": "",
    "explanation": "sortWithinPartitions sorts locally inside each partition; orderBy performs a global sort.",
    "options": [
      "sortWithinPartitions",
      "orderBy",
      "collect_list",
      "repartitionByRange followed by collect"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0028",
    "domain": "Ingest and transform data",
    "topic": "PySpark pivot",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the pivot that creates one revenue column per Quarter for each Region.",
    "code": "quarterly = sales.[1](\"Region\").[2](\"Quarter\").[3]({\"Revenue\":\"sum\"})",
    "explanation": "groupBy defines rows, pivot defines columns, and agg computes the values.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "groupBy",
          "partitionBy",
          "orderBy",
          "select"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "pivot",
          "rollup",
          "cube",
          "stack"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "agg",
          "filter",
          "join",
          "distinct"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0029",
    "domain": "Ingest and transform data",
    "topic": "PySpark conditional logic",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the classification column without a Python UDF.",
    "code": "from pyspark.sql.functions import [1], col\nclassified = df.withColumn(\"RiskBand\",\n    [1](col(\"Score\") >= 800, \"Low\")\n      .when(col(\"Score\") >= 600, \"Medium\")\n      .[2](\"High\"))",
    "explanation": "when(...).when(...).otherwise(...) expresses optimized columnar conditional logic.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "when",
          "where",
          "case",
          "ifelse"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "otherwise",
          "else",
          "default",
          "fillna"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0030",
    "domain": "Ingest and transform data",
    "topic": "PySpark date range",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "An incremental extraction must include records with ModifiedAt equal to the lower watermark but exclude the upper watermark to avoid duplicates between adjacent windows. Which predicate is correct?",
    "code": "",
    "explanation": "A half-open interval [lower, upper) composes cleanly across adjacent runs.",
    "options": [
      "(ModifiedAt >= lower) & (ModifiedAt < upper)",
      "(ModifiedAt > lower) & (ModifiedAt <= upper)",
      "ModifiedAt == lower",
      "ModifiedAt between lower and upper inclusive"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0031",
    "domain": "Ingest and transform data",
    "topic": "PySpark late arriving data",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A source occasionally sends updates up to three days late. Which two design choices make an incremental load robust?",
    "code": "",
    "explanation": "An overlap window captures late arrivals; an idempotent merge prevents duplicate results.",
    "options": [
      "Re-read an overlap window that includes the late-arrival period",
      "Use an idempotent MERGE keyed by the business key",
      "Advance the watermark before extraction starts",
      "Append blindly without deduplication",
      "Delete Bronze after each run"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0032",
    "domain": "Monitor and optimize",
    "topic": "Spark checkpoints",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A DataFrame has an extremely long lineage caused by many iterative transformations, and recomputation after a failure is expensive. Which operation can truncate the lineage?",
    "code": "",
    "explanation": "Checkpoint materializes the DataFrame and cuts off its prior lineage.",
    "options": [
      "checkpoint() after configuring a checkpoint directory",
      "show()",
      "printSchema()",
      "dropDuplicates()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0033",
    "domain": "Ingest and transform data",
    "topic": "PySpark map columns",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A MapType column Attributes contains a key named color. Which expression retrieves it?",
    "code": "",
    "explanation": "Map entries can be accessed with bracket notation on the map column.",
    "options": [
      "col(\"Attributes\")[\"color\"]",
      "col(\"Attributes.color\").explode()",
      "map(\"Attributes\",\"color\")",
      "col(\"color\").from_map()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0034",
    "domain": "Ingest and transform data",
    "topic": "PySpark file metadata",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to add the source file path to each ingested row for auditability. Which function is appropriate?",
    "code": "",
    "explanation": "input_file_name returns the path of the file from which each row was read.",
    "options": [
      "input_file_name()",
      "current_database()",
      "spark_partition_id() only",
      "monotonically_increasing_id()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0035",
    "domain": "Monitor and optimize",
    "topic": "Spark shuffle partitions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A 30-MB aggregation creates 4,000 shuffle partitions, producing scheduling overhead and tiny tasks. Which setting should you evaluate?",
    "code": "",
    "explanation": "spark.sql.shuffle.partitions controls the default number of post-shuffle partitions.",
    "options": [
      "spark.sql.shuffle.partitions",
      "spark.driver.maxResultSize",
      "spark.sql.files.ignoreMissingFiles",
      "spark.sql.session.timeZone"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0036",
    "domain": "Monitor and optimize",
    "topic": "Adaptive Query Execution",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two runtime optimizations can Adaptive Query Execution perform?",
    "code": "",
    "explanation": "AQE uses runtime statistics to coalesce shuffle partitions and revise join strategies.",
    "options": [
      "Coalesce small post-shuffle partitions",
      "Switch join strategies when runtime statistics justify it",
      "Change workspace roles",
      "Create a semantic model",
      "Apply sensitivity labels"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0037",
    "domain": "Ingest and transform data",
    "topic": "PySpark write modes",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A notebook writes only the July 2026 partition and must not replace other months. Which design is safest?",
    "code": "",
    "explanation": "A scoped overwrite replaces only the intended partition range.",
    "options": [
      "Use a partition-scoped overwrite mechanism such as replaceWhere with the July predicate",
      "Use mode(\"overwrite\") without a predicate",
      "Delete the entire table first",
      "Append the corrected rows and keep old July rows"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0038",
    "domain": "Ingest and transform data",
    "topic": "PySpark schema enforcement",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A production JSON feed has a published contract. Which two practices make schema handling safer?",
    "code": "",
    "explanation": "Explicit schemas and rejected-record handling make drift visible and controlled.",
    "options": [
      "Provide an explicit schema",
      "Capture malformed or rescued records for review",
      "Infer the schema independently on every file",
      "Cast every field to string permanently",
      "Ignore missing required columns"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0039",
    "domain": "Ingest and transform data",
    "topic": "PySpark broadcast limits",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A developer forces broadcast() on a 9-GB dimension and executors fail with memory pressure. What is the best correction?",
    "code": "",
    "explanation": "Broadcast is suitable only when the relation can be safely replicated to executors.",
    "options": [
      "Remove the forced broadcast and use an appropriate distributed join strategy",
      "Collect the 9-GB dimension to the driver",
      "Coalesce the fact table to one partition",
      "Increase the KQL cache window"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0040",
    "domain": "Ingest and transform data",
    "topic": "PySpark join condition",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete a range join that matches an event to the price record effective at the event time.",
    "code": "e = events.alias(\"e\")\np = prices.alias(\"p\")\nmatched = e.join(p,\n    (col(\"e.ProductID\") == col(\"p.ProductID\")) &\n    (col(\"e.EventTs\") [1] col(\"p.ValidFrom\")) &\n    (col(\"e.EventTs\") [2] col(\"p.ValidTo\")),\n    [3])",
    "explanation": "The effective interval is commonly modeled as ValidFrom inclusive and ValidTo exclusive; a left join preserves unmatched events.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          ">=",
          ">",
          "==",
          "<="
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "<",
          "<=",
          ">",
          "=="
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "\"left\"",
          "\"cross\"",
          "\"left_anti\"",
          "\"right\""
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0041",
    "domain": "Ingest and transform data",
    "topic": "PySpark SCD2",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange the core steps for an SCD Type 2 dimension load.",
    "code": "",
    "explanation": "SCD2 expires changed current rows, inserts replacement versions, adds new keys, then validates uniqueness of the current version.",
    "options": [
      "Identify source rows whose tracked attributes changed",
      "Expire the current target version by setting EndDate and IsCurrent=false",
      "Insert a new version with a new surrogate key and IsCurrent=true",
      "Insert entirely new business keys",
      "Validate that each business key has at most one current row"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4
    ]
  },
  {
    "id": "DP7U-0042",
    "domain": "Ingest and transform data",
    "topic": "PySpark column selection",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A transformation needs every existing column except RawPayload and DebugNotes. Which expression is clearest?",
    "code": "",
    "explanation": "drop removes the named columns while preserving the rest.",
    "options": [
      "df.drop(\"RawPayload\", \"DebugNotes\")",
      "df.select(\"RawPayload\", \"DebugNotes\")",
      "df.distinct()",
      "df.unpersist()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0043",
    "domain": "Monitor and optimize",
    "topic": "Spark small files",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A streaming-style micro-batch job creates thousands of tiny Delta files. Which two actions directly improve file layout?",
    "code": "",
    "explanation": "Optimized writes/auto-compaction reduce file proliferation, and OPTIMIZE compacts accumulated files.",
    "options": [
      "Enable or use optimized writes/auto-compaction where appropriate",
      "Schedule OPTIMIZE for additional compaction",
      "Increase the number of output partitions dramatically",
      "Collect each batch to the driver",
      "Disable Delta transactions"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0044",
    "domain": "Ingest and transform data",
    "topic": "PySpark sampling",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a reproducible 5% sample for testing. Which expression is appropriate?",
    "code": "",
    "explanation": "sample with a fixed seed provides reproducible probabilistic sampling.",
    "options": [
      "df.sample(withReplacement=False, fraction=0.05, seed=42)",
      "df.limit(int(df.count()*0.05)) without ordering",
      "df.rand(0.05)",
      "df.collect()[::20]"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0045",
    "domain": "Ingest and transform data",
    "topic": "PySpark grouping",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need subtotal rows by (Region, ProductCategory), by Region, and a grand total in one aggregation. Which grouping operator is suitable?",
    "code": "",
    "explanation": "rollup produces hierarchical subtotals and a grand total.",
    "options": [
      "rollup",
      "pivot",
      "explode",
      "left_anti"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0046",
    "domain": "Ingest and transform data",
    "topic": "PySpark grouping",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need every combination of subtotals across Region and Channel plus the grand total. Which grouping operator is appropriate?",
    "code": "",
    "explanation": "cube produces aggregates for all combinations of the grouping columns.",
    "options": [
      "cube",
      "rollup",
      "dropDuplicates",
      "repartitionByRange"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0047",
    "domain": "Monitor and optimize",
    "topic": "Spark range partitioning",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A downstream write benefits from rows distributed by contiguous EventDate ranges. Which transformation is designed for this?",
    "code": "",
    "explanation": "repartitionByRange partitions rows according to ordered ranges of the specified columns.",
    "options": [
      "repartitionByRange",
      "randomSplit",
      "coalesce",
      "broadcast"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0048",
    "domain": "Ingest and transform data",
    "topic": "PySpark output prediction",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "What does the following code return for a key that appears three times with values 10, null, and 5?",
    "code": "df.groupBy(\"Key\").agg(sum(\"Value\").alias(\"Total\"))",
    "explanation": "Spark sum ignores null inputs when non-null values are present.",
    "options": [
      "15",
      "null",
      "10",
      "Three separate rows"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0049",
    "domain": "Ingest and transform data",
    "topic": "PySpark output prediction",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A DataFrame contains rows (A,1), (A,1), and (A,2). What is the result of df.dropDuplicates([\"Key\",\"Value\"]).count()?",
    "code": "",
    "explanation": "The duplicate (A,1) pair is removed, leaving (A,1) and (A,2).",
    "options": [
      "2",
      "1",
      "3",
      "0"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0050",
    "domain": "Monitor and optimize",
    "topic": "Spark failure diagnosis",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A task repeatedly fails with ExecutorLostFailure only for one partition. The partition is much larger than the others. What should you investigate first?",
    "code": "",
    "explanation": "A single oversized partition commonly causes executor memory pressure and repeated task failure.",
    "options": [
      "Data skew and partition-size imbalance",
      "Workspace sensitivity labels",
      "Power BI visual interactions",
      "The Eventhouse retention policy"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0051",
    "domain": "Ingest and transform data",
    "topic": "PySpark merge semantics",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Delta MERGE source contains two rows for the same target key, and both match one target row. What should you do before the merge?",
    "code": "",
    "explanation": "Multiple source matches can make merge semantics ambiguous or fail; source keys should be unique.",
    "options": [
      "Deterministically deduplicate the source to one row per merge key",
      "Increase the broadcast threshold",
      "Run VACUUM",
      "Convert the target to CSV"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0052",
    "domain": "Ingest and transform data",
    "topic": "KQL time filtering",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to return events from the last 45 minutes.",
    "code": "Telemetry\n| where EventTime > [1]\n| [2] 100 by EventTime [3]",
    "explanation": "ago creates a relative lower bound; top N by EventTime desc returns the newest rows.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "ago(45m)",
          "now(45m)",
          "bin(EventTime,45m)",
          "datetime_add(\"minute\",45,now())"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "top",
          "take",
          "limit",
          "sort"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "desc",
          "asc",
          "latest",
          "down"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0053",
    "domain": "Ingest and transform data",
    "topic": "KQL dynamic JSON",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to parse a JSON payload and extract a numeric temperature.",
    "code": "Telemetry\n| extend d = [1](Payload)\n| extend Temperature = [2](d.metrics.temperature)\n| [3] DeviceId, EventTime, Temperature",
    "explanation": "parse_json converts the string to dynamic, todouble converts the nested value, and project selects output columns.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "parse_json",
          "parse",
          "extract",
          "todynamic_array"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "todouble",
          "tostring",
          "todatetime",
          "toint_array"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "project",
          "summarize",
          "where",
          "join"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0054",
    "domain": "Ingest and transform data",
    "topic": "KQL latest row",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to return the entire latest row for each DeviceId.",
    "code": "Telemetry\n| summarize [1]([2], [3]) by DeviceId",
    "explanation": "arg_max(EventTime, *) returns all columns from the row with the maximum timestamp per device.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "arg_max",
          "max",
          "top",
          "take_any"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "EventTime",
          "DeviceId",
          "count()",
          "1h"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "*",
          "EventTime",
          "DeviceId",
          "count"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0055",
    "domain": "Ingest and transform data",
    "topic": "KQL token search",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You must match SQL as a separate indexed term while excluding SQLServer and MySQL. Which operator is best?",
    "code": "",
    "explanation": "has performs term-based matching, while contains matches substrings.",
    "options": [
      "has",
      "contains",
      "startswith",
      "endswith"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0056",
    "domain": "Ingest and transform data",
    "topic": "KQL time aggregation",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which query calculates hourly average CPU by Host for the last seven days?",
    "code": "",
    "explanation": "Filter the time window, then summarize by Host and a binned timestamp.",
    "options": [
      "Metrics | where TimeGenerated > ago(7d) | summarize AvgCPU=avg(CPU) by Host, bin(TimeGenerated,1h)",
      "Metrics | project avg(CPU) by Host",
      "Metrics | summarize arg_max(CPU,*) by 1h",
      "Metrics | where bin(TimeGenerated,1h)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0057",
    "domain": "Ingest and transform data",
    "topic": "KQL conditional aggregation",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to calculate total events and failed events by service.",
    "code": "Logs\n| summarize Total=[1](), Failed=[2](Status == \"Failed\") by Service\n| extend FailureRate = 100.0 * Failed / [3]",
    "explanation": "count counts all rows; countif counts only failed rows; divide by Total for the rate.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "count",
          "sum",
          "dcount",
          "countif"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "countif",
          "count",
          "sumif",
          "where"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "Total",
          "Failed",
          "Service",
          "Status"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0058",
    "domain": "Ingest and transform data",
    "topic": "KQL distinct counts",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A query needs an approximate distinct user count with lower memory usage over billions of rows. Which aggregation is appropriate?",
    "code": "",
    "explanation": "dcount uses an approximate distinct-count algorithm suitable for large data volumes.",
    "options": [
      "dcount(UserId)",
      "count_distinct(UserId) only",
      "make_set(UserId) followed by array_length",
      "count(UserId)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0059",
    "domain": "Ingest and transform data",
    "topic": "KQL arrays",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to turn each element of a dynamic Tags array into a separate row.",
    "code": "Events\n| extend Tags=[1](TagsJson)\n| [2] Tag = Tags\n| project EventId, Tag=[3](Tag)",
    "explanation": "parse_json creates a dynamic array, mv-expand emits one row per element, and tostring converts the element.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "parse_json",
          "tostring",
          "extract",
          "pack_array"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "mv-expand",
          "mv-apply",
          "summarize",
          "project-away"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "tostring",
          "todouble",
          "todatetime",
          "tohex"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0060",
    "domain": "Ingest and transform data",
    "topic": "KQL regular expressions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Message column contains text such as order=AB-10492. Which function can extract the order identifier using a capture group?",
    "code": "",
    "explanation": "extract applies a regular expression and returns the requested capture group.",
    "options": [
      "extract(@\"order=([A-Z]{2}-\\d+)\", 1, Message)",
      "contains(Message,\"order=\")",
      "project-away Message",
      "arg_max(Message,*)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0061",
    "domain": "Ingest and transform data",
    "topic": "KQL parse operator",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Logs contain a fixed pattern: \"user=42 action=login latency=18\". Which operator is designed to parse multiple fields from this repeated textual pattern?",
    "code": "",
    "explanation": "parse extracts multiple values from a consistent string pattern.",
    "options": [
      "parse",
      "contains",
      "summarize",
      "serialize"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0062",
    "domain": "Ingest and transform data",
    "topic": "KQL lookup",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A very small Regions table enriches a large Events table by RegionCode. Which operator expresses a fact-to-small-dimension enrichment and assumes the right side is small?",
    "code": "",
    "explanation": "lookup is optimized for enriching a large left table with a small right dimension.",
    "options": [
      "lookup",
      "union",
      "mv-expand",
      "fork"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0063",
    "domain": "Ingest and transform data",
    "topic": "KQL join kinds",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need rows from Requests whose CorrelationId has no matching row in Responses. Which join kind should you use?",
    "code": "",
    "explanation": "leftanti returns left-side rows without a right-side match.",
    "options": [
      "leftanti",
      "leftsemi",
      "innerunique",
      "fullouter"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0064",
    "domain": "Ingest and transform data",
    "topic": "KQL join kinds",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need only Request rows whose CorrelationId exists in Responses, without adding Response columns. Which join kind is appropriate?",
    "code": "",
    "explanation": "leftsemi filters the left side to matching keys without returning right-side columns.",
    "options": [
      "leftsemi",
      "leftanti",
      "rightouter",
      "cross"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0065",
    "domain": "Ingest and transform data",
    "topic": "KQL join",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to correlate requests and responses by CorrelationId while preserving every request.",
    "code": "Requests\n| join kind=[1] (Responses | project CorrelationId, ResponseTime, Result) on [2]\n| extend DurationMs = datetime_diff(\"millisecond\", ResponseTime, [3])",
    "explanation": "leftouter preserves every request; the join key is CorrelationId; duration compares response and request timestamps.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "leftouter",
          "inner",
          "leftanti",
          "rightsemi"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "CorrelationId",
          "RequestTime",
          "Result",
          "ResponseTime"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "RequestTime",
          "ResponseTime",
          "now()",
          "CorrelationId"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0066",
    "domain": "Ingest and transform data",
    "topic": "KQL sets",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a dynamic array of unique error codes observed for each Service. Which aggregation should you use?",
    "code": "",
    "explanation": "make_set returns unique values as a dynamic array.",
    "options": [
      "make_set(ErrorCode)",
      "make_list(ErrorCode)",
      "dcount(ErrorCode)",
      "strcat_array(ErrorCode)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0067",
    "domain": "Ingest and transform data",
    "topic": "KQL lists",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a dynamic array that retains repeated Status values for each SessionId. Which aggregation is appropriate?",
    "code": "",
    "explanation": "make_list retains values, including duplicates, in a dynamic array.",
    "options": [
      "make_list(Status)",
      "make_set(Status)",
      "dcount(Status)",
      "countif(Status)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0068",
    "domain": "Ingest and transform data",
    "topic": "KQL projection",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two operators can remove columns from the output schema?",
    "code": "",
    "explanation": "project selects the output columns; project-away explicitly removes named columns.",
    "options": [
      "project with only required columns",
      "project-away with unwanted columns",
      "extend",
      "where",
      "summarize only when no grouping is used"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0069",
    "domain": "Ingest and transform data",
    "topic": "KQL scalar values",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query that calculates a global threshold once and uses it to filter rows.",
    "code": "let threshold = [1](Metrics | summarize p95=[2](LatencyMs,95) | project p95);\nMetrics\n| where LatencyMs > [3]",
    "explanation": "toscalar converts the one-row tabular result into a scalar threshold; percentile computes p95.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "toscalar",
          "materialize",
          "scalar",
          "let"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "percentile",
          "avg",
          "arg_max",
          "varianceif"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "threshold",
          "p95",
          "toscalar",
          "LatencyMs"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0070",
    "domain": "Monitor and optimize",
    "topic": "KQL materialize",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "The same expensive filtered subquery is referenced three times in one KQL statement. Which function can cache its tabular result for reuse within that query?",
    "code": "",
    "explanation": "materialize evaluates and caches a tabular expression for reuse in the current query.",
    "options": [
      "materialize()",
      "toscalar()",
      "serialize",
      "render"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0071",
    "domain": "Ingest and transform data",
    "topic": "KQL let statements",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which construct assigns a reusable name to a scalar or tabular expression at the beginning of a KQL query?",
    "code": "",
    "explanation": "let binds a name to a scalar value, function, or tabular expression.",
    "options": [
      "let",
      "set",
      "declare",
      "with"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0072",
    "domain": "Ingest and transform data",
    "topic": "KQL conditional expressions",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the expression that assigns a severity label using multiple conditions.",
    "code": "Events\n| extend Severity = [1](ErrorCount >= 10, \"Critical\", ErrorCount >= 5, \"High\", ErrorCount > 0, \"Medium\", [2])",
    "explanation": "case evaluates multiple condition/result pairs and finishes with a default value.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "case",
          "iff",
          "coalesce",
          "choose"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "\"None\"",
          "null",
          "0",
          "false"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0073",
    "domain": "Ingest and transform data",
    "topic": "KQL null handling",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the first non-null value among PreferredName, DisplayName, and UserPrincipalName. Which function is appropriate?",
    "code": "",
    "explanation": "coalesce returns the first non-null argument.",
    "options": [
      "coalesce(PreferredName,DisplayName,UserPrincipalName)",
      "strcat(PreferredName,DisplayName,UserPrincipalName)",
      "take_any(PreferredName)",
      "iff(isnull(PreferredName),null,DisplayName)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0074",
    "domain": "Ingest and transform data",
    "topic": "KQL row order",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A query uses row_number() after sorting and must preserve the serialized row order. Which operator should appear before the row-context function?",
    "code": "",
    "explanation": "serialize marks the row set as ordered for functions that depend on row order.",
    "options": [
      "serialize",
      "summarize",
      "lookup",
      "union"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0075",
    "domain": "Ingest and transform data",
    "topic": "KQL previous row",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to calculate the time since the previous event for each device after ordering by DeviceId and EventTime.",
    "code": "Telemetry\n| sort by DeviceId asc, EventTime asc\n| [1]\n| extend PreviousDevice=[2](DeviceId), PreviousTime=[2](EventTime)\n| extend GapSeconds = iff(DeviceId == PreviousDevice, datetime_diff(\"second\", EventTime, PreviousTime), [3])",
    "explanation": "serialize preserves order; prev reads the preceding row; a null gap starts each device sequence.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "serialize",
          "summarize",
          "project",
          "distinct"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "prev",
          "next",
          "lag",
          "arg_min"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "long(null)",
          "0",
          "-1",
          "EventTime"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0076",
    "domain": "Ingest and transform data",
    "topic": "KQL top nested",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the three highest-latency requests within each Service. Which operator is designed for top N per group?",
    "code": "",
    "explanation": "top-nested supports hierarchical top-N selection within groups.",
    "options": [
      "top-nested",
      "top",
      "take",
      "sample-distinct"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0077",
    "domain": "Ingest and transform data",
    "topic": "KQL union",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "You union tables from optional regional databases, some of which may not exist. Which two query design choices improve resilience and lineage?",
    "code": "",
    "explanation": "isfuzzy tolerates unresolved union legs under supported conditions, and withsource records origin.",
    "options": [
      "Use union isfuzzy=true when missing sources should be tolerated",
      "Use withsource= to capture the originating table",
      "Use a cross join between all regions",
      "Delete the regional tables after union",
      "Convert timestamps to dynamic arrays"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0078",
    "domain": "Ingest and transform data",
    "topic": "KQL time window join",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A login event must be matched to an MFA event for the same UserId occurring within five minutes. Which design is most appropriate?",
    "code": "",
    "explanation": "Entity correlation requires a key join plus an explicit time-distance condition.",
    "options": [
      "Join on UserId and add a predicate comparing the two timestamps within the allowed window",
      "Union the tables and count rows",
      "Use mv-expand on UserId",
      "Use project-away on both timestamps"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0079",
    "domain": "Monitor and optimize",
    "topic": "Eventhouse materialized views",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A dashboard repeatedly computes the same hourly DeviceId aggregation over billions of raw rows, and some ingestion-time maintenance is acceptable. What should you create?",
    "code": "",
    "explanation": "A materialized view incrementally maintains a precomputed result for lower query latency.",
    "options": [
      "A materialized view",
      "A stored function that rescans all raw rows each time",
      "A OneLake shortcut only",
      "A Power BI bookmark"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0080",
    "domain": "Monitor and optimize",
    "topic": "Eventhouse retention and cache",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "An Eventhouse must retain data for four years, but only the latest 21 days need the fastest query performance. Which two policies should be configured separately?",
    "code": "",
    "explanation": "Retention controls data lifetime; caching controls the hot, high-performance window.",
    "options": [
      "Retention policy for four years",
      "Caching policy for the latest 21 days",
      "Dynamic data masking for the latest 21 days",
      "Spark broadcast policy",
      "Deployment pipeline rule"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0081",
    "domain": "Ingest and transform data",
    "topic": "KQL ingestion mapping",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Incoming JSON property names do not match the destination Eventhouse table columns. Which object should define how source fields map to target columns during ingestion?",
    "code": "",
    "explanation": "An ingestion mapping maps source JSON paths to destination columns and types.",
    "options": [
      "A JSON ingestion mapping",
      "A Power BI relationship",
      "A Spark broadcast hint",
      "A deployment rule"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0082",
    "domain": "Ingest and transform data",
    "topic": "KQL update policy",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Raw events are ingested into RawTelemetry. You want a transformed target table populated automatically as raw data arrives. Which feature is designed for this?",
    "code": "",
    "explanation": "An update policy applies a transformation from a source table to a target table during ingestion.",
    "options": [
      "An update policy",
      "A retention policy",
      "A caching policy",
      "A sensitivity label"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0083",
    "domain": "Monitor and optimize",
    "topic": "KQL query reduction",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two practices usually reduce Eventhouse query work?",
    "code": "",
    "explanation": "Early selective filtering and narrow projection reduce scanned and processed data.",
    "options": [
      "Filter early on selective predicates such as time",
      "Project only required columns before expensive joins",
      "Return every dynamic payload field",
      "Use contains when an indexed term search with has is sufficient",
      "Expand all arrays before filtering"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0084",
    "domain": "Ingest and transform data",
    "topic": "KQL output prediction",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "What does summarize count() by Status return?",
    "code": "",
    "explanation": "summarize groups by Status and calculates count for each group.",
    "options": [
      "One row per distinct Status with the number of input rows in that group",
      "A single row containing every Status value",
      "The latest row for each Status",
      "Only rows where Status is not null without counts"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0085",
    "domain": "Ingest and transform data",
    "topic": "KQL output prediction",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A table has values A, A, B, and null in column Code. What does dcount(Code) conceptually estimate?",
    "code": "",
    "explanation": "dcount estimates distinct non-null values; here the distinct values are A and B.",
    "options": [
      "The number of distinct non-null Code values, approximately 2",
      "The number of rows, 4",
      "The number of null rows, 1",
      "The alphabetic position of B"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0086",
    "domain": "Ingest and transform data",
    "topic": "KQL bag expansion",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A dynamic property bag must be expanded into columns whose names come from the bag keys. Which plugin is intended for this?",
    "code": "",
    "explanation": "bag_unpack expands property-bag slots into output columns.",
    "options": [
      "evaluate bag_unpack(Properties)",
      "mv-expand Properties",
      "summarize make_bag(Properties)",
      "parse_json without further expansion"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0087",
    "domain": "Ingest and transform data",
    "topic": "KQL percentile",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which aggregation returns the 50th, 95th, and 99th latency percentiles in one operation?",
    "code": "",
    "explanation": "percentiles computes multiple requested percentile values.",
    "options": [
      "percentiles(LatencyMs,50,95,99)",
      "avg(LatencyMs,50,95,99)",
      "arg_max(LatencyMs,50,95,99)",
      "bin(LatencyMs,50,95,99)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0088",
    "domain": "Ingest and transform data",
    "topic": "KQL histogram",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need request counts in 100-millisecond latency buckets. Which expression should be used in the summarize grouping?",
    "code": "",
    "explanation": "bin groups numeric values into fixed-width buckets.",
    "options": [
      "bin(LatencyMs,100)",
      "ago(100ms)",
      "round(LatencyMs,100)",
      "top 100 by LatencyMs"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0089",
    "domain": "Ingest and transform data",
    "topic": "KQL datetime arithmetic",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the duration calculation between StartTime and EndTime.",
    "code": "Jobs\n| extend DurationMinutes = [1](\"minute\", [2], [3])",
    "explanation": "datetime_diff(unit, end, start) returns the elapsed units between the two timestamps.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "datetime_diff",
          "datetime_add",
          "datepart",
          "bin_at"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "EndTime",
          "StartTime",
          "now()",
          "Duration"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "StartTime",
          "EndTime",
          "Duration",
          "1m"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0090",
    "domain": "Ingest and transform data",
    "topic": "KQL string splitting",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A ResourceId has slash-delimited segments, and you need the final segment. Which expression is suitable?",
    "code": "",
    "explanation": "split returns a dynamic array; the -1 index selects the final segment.",
    "options": [
      "tostring(split(ResourceId,\"/\")[-1])",
      "contains(ResourceId,\"/\")",
      "make_set(ResourceId)",
      "bin(ResourceId,1)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0091",
    "domain": "Ingest and transform data",
    "topic": "KQL case sensitivity",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a case-sensitive substring search. Which operator should you use?",
    "code": "",
    "explanation": "The _cs suffix requests case-sensitive matching.",
    "options": [
      "contains_cs",
      "contains",
      "has",
      "startswith"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0092",
    "domain": "Ingest and transform data",
    "topic": "KQL exact equality",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need exact case-sensitive equality against the string \"Failed\". Which comparison is appropriate?",
    "code": "",
    "explanation": "== performs case-sensitive string equality; =~ is case-insensitive equality.",
    "options": [
      "Status == \"Failed\"",
      "Status =~ \"Failed\"",
      "Status has \"Failed\"",
      "Status contains \"Failed\""
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0093",
    "domain": "Ingest and transform data",
    "topic": "KQL anomaly series",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to detect anomalies in an hourly time series after creating a numeric series. Which function is intended for decomposition-based anomaly detection?",
    "code": "",
    "explanation": "series_decompose_anomalies identifies anomalous points in a numeric series.",
    "options": [
      "series_decompose_anomalies()",
      "arg_max()",
      "make_set()",
      "lookup"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0094",
    "domain": "Ingest and transform data",
    "topic": "KQL make-series",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to build an hourly event-count series for each DeviceId.",
    "code": "Telemetry\n| make-series EventCount=[1]() default=0 on EventTime from ago(1d) to now() step [2] by [3]",
    "explanation": "make-series aggregates into regular time bins and can create one series per DeviceId.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "count",
          "sum",
          "dcount",
          "arg_max"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "1h",
          "bin(1h)",
          "60",
          "ago(1h)"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "DeviceId",
          "EventTime",
          "EventCount",
          "1h"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0095",
    "domain": "Monitor and optimize",
    "topic": "KQL join strategy",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A join uses a very small right table and a massive left table. Which hint may be appropriate after verifying size assumptions?",
    "code": "",
    "explanation": "A broadcast strategy can replicate a small side and avoid repartitioning the massive side.",
    "options": [
      "hint.strategy=broadcast",
      "hint.strategy=shuffle on the tiny side only",
      "hint.remote=local for every cluster",
      "materialize the massive table on the client"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0096",
    "domain": "Ingest and transform data",
    "topic": "KQL match order",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange the logical steps for enriching raw JSON telemetry and returning the latest warning per device.",
    "code": "",
    "explanation": "Filter early, parse and type data, apply the business predicate, select the latest row, then narrow the output.",
    "options": [
      "Filter to the required time window",
      "Parse the JSON payload",
      "Convert required dynamic properties to typed columns",
      "Filter to warning records",
      "Use arg_max to select the latest row per device",
      "Project only the reporting columns"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "DP7U-0097",
    "domain": "Ingest and transform data",
    "topic": "KQL operator matching",
    "type": "match",
    "difficulty": "Expert",
    "prompt": "Match each KQL operator to its primary purpose.",
    "code": "",
    "explanation": "Each operator has a distinct row-selection or schema-shaping purpose.",
    "left": [
      "arg_max",
      "mv-expand",
      "project-away",
      "leftanti join"
    ],
    "right": [
      "Return columns from the row containing the maximum expression",
      "Expand elements of a dynamic array or bag into rows",
      "Remove specified columns",
      "Return left rows with no right match"
    ],
    "answer": {
      "arg_max": "Return columns from the row containing the maximum expression",
      "mv-expand": "Expand elements of a dynamic array or bag into rows",
      "project-away": "Remove specified columns",
      "leftanti join": "Return left rows with no right match"
    }
  },
  {
    "id": "DP7U-0098",
    "domain": "Ingest and transform data",
    "topic": "T-SQL MERGE",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the idempotent MERGE that updates changed rows and inserts new rows.",
    "code": "MERGE dbo.Customer AS T\nUSING dbo.StageCustomer AS S\nON [1]\nWHEN MATCHED AND T.RowHash <> S.RowHash THEN\n  [2]\nWHEN NOT MATCHED BY TARGET THEN\n  [3];",
    "explanation": "The business key defines matches; changed matches update, and missing target keys insert.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "T.CustomerID = S.CustomerID",
          "T.CustomerID <> S.CustomerID",
          "T.RowHash IS NULL",
          "1 = 0"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "UPDATE SET T.Name=S.Name, T.RowHash=S.RowHash",
          "DELETE",
          "INSERT VALUES(S.CustomerID)",
          "TRUNCATE TABLE dbo.Customer"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "INSERT (CustomerID,Name,RowHash) VALUES(S.CustomerID,S.Name,S.RowHash)",
          "UPDATE SET T.CustomerID=S.CustomerID",
          "DELETE",
          "RETURN"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0099",
    "domain": "Ingest and transform data",
    "topic": "T-SQL deduplication",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query to keep the newest staged row per InvoiceNumber.",
    "code": "WITH Ranked AS (\n SELECT *, [1]() OVER([2] BY InvoiceNumber ORDER BY ModifiedAt DESC, IngestSequence DESC) AS rn\n FROM dbo.StageInvoice\n)\nSELECT * FROM Ranked WHERE rn [3] 1;",
    "explanation": "ROW_NUMBER partitioned by InvoiceNumber creates a deterministic winner, filtered by rn=1.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "ROW_NUMBER",
          "COUNT",
          "LAG",
          "NTILE"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "PARTITION",
          "GROUP",
          "DISTRIBUTE",
          "CLUSTER"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "=",
          ">",
          "<",
          "<>"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0100",
    "domain": "Ingest and transform data",
    "topic": "T-SQL window functions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the previous transaction amount within each AccountId ordered by TransactionTime. Which function is appropriate?",
    "code": "",
    "explanation": "LAG reads a value from a preceding row in the ordered partition.",
    "options": [
      "LAG(Amount) OVER(PARTITION BY AccountId ORDER BY TransactionTime)",
      "LEAD(Amount) OVER(PARTITION BY AccountId ORDER BY TransactionTime)",
      "FIRST_VALUE(AccountId) without an OVER clause",
      "COUNT(Amount) GROUP BY TransactionTime"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0101",
    "domain": "Ingest and transform data",
    "topic": "T-SQL window functions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the next scheduled maintenance date for each MachineId. Which window function should you use?",
    "code": "",
    "explanation": "LEAD returns the following row value within each ordered machine partition.",
    "options": [
      "LEAD(MaintenanceDate) OVER(PARTITION BY MachineId ORDER BY MaintenanceDate)",
      "LAG(MaintenanceDate) without ordering",
      "ROW_NUMBER over all machines",
      "SUM(MaintenanceDate)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0102",
    "domain": "Ingest and transform data",
    "topic": "T-SQL ranking",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Scores 100, 100, and 90 must receive ranks 1, 1, and 2. Which function should you use?",
    "code": "",
    "explanation": "DENSE_RANK does not leave a gap after tied values.",
    "options": [
      "DENSE_RANK",
      "RANK",
      "ROW_NUMBER",
      "NTILE"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0103",
    "domain": "Ingest and transform data",
    "topic": "T-SQL ranking",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Scores 100, 100, and 90 must receive ranks 1, 1, and 3. Which function should you use?",
    "code": "",
    "explanation": "RANK leaves gaps after ties.",
    "options": [
      "RANK",
      "DENSE_RANK",
      "ROW_NUMBER",
      "LAG"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0104",
    "domain": "Ingest and transform data",
    "topic": "T-SQL running totals",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the running revenue total by CustomerId.",
    "code": "SELECT CustomerId, OrderDate, Revenue,\n SUM(Revenue) OVER(\n   [1] BY CustomerId\n   ORDER BY OrderDate\n   ROWS BETWEEN [2] AND [3]\n ) AS RunningRevenue\nFROM dbo.Sales;",
    "explanation": "The frame from unbounded preceding through the current row calculates a cumulative total per customer.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "PARTITION",
          "GROUP",
          "CLUSTER",
          "DISTRIBUTE"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "UNBOUNDED PRECEDING",
          "CURRENT ROW",
          "1 FOLLOWING",
          "UNBOUNDED FOLLOWING"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "CURRENT ROW",
          "UNBOUNDED PRECEDING",
          "1 PRECEDING",
          "UNBOUNDED FOLLOWING"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0105",
    "domain": "Ingest and transform data",
    "topic": "T-SQL conditional aggregation",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which expression counts failed rows while grouping by PipelineName?",
    "code": "",
    "explanation": "Conditional SUM converts failed rows to 1 and all others to 0.",
    "options": [
      "SUM(CASE WHEN Status = 'Failed' THEN 1 ELSE 0 END)",
      "COUNT(Status = 'Failed')",
      "WHERE COUNT(Status) = 'Failed'",
      "LAG(Status = 'Failed')"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0106",
    "domain": "Ingest and transform data",
    "topic": "T-SQL null handling",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the first non-null value from PreferredPhone, MobilePhone, and HomePhone. Which expression is appropriate?",
    "code": "",
    "explanation": "COALESCE returns the first non-null expression from a list.",
    "options": [
      "COALESCE(PreferredPhone,MobilePhone,HomePhone)",
      "CONCAT(PreferredPhone,MobilePhone,HomePhone)",
      "NULLIF(PreferredPhone,MobilePhone,HomePhone)",
      "ISNULL with three arguments"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0107",
    "domain": "Ingest and transform data",
    "topic": "T-SQL safe arithmetic",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A margin percentage calculation must not fail when Revenue is zero. Which denominator expression is appropriate?",
    "code": "",
    "explanation": "NULLIF returns null when Revenue is zero, preventing a divide-by-zero error.",
    "options": [
      "NULLIF(Revenue,0)",
      "COALESCE(Revenue,0)",
      "ABS(Revenue)",
      "ROUND(Revenue,0)"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0108",
    "domain": "Ingest and transform data",
    "topic": "T-SQL dates",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the expression that returns the first day of the month containing InvoiceDate.",
    "code": "SELECT [1]([2](month, [3], 0), 0) AS MonthStart FROM dbo.Invoice;",
    "explanation": "DATEADD(month, DATEDIFF(month,0,InvoiceDate),0) returns the month start in broadly supported T-SQL.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "DATEADD",
          "DATEDIFF",
          "DATETRUNC",
          "EOMONTH"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "DATEDIFF",
          "DATEADD",
          "DATEPART",
          "FORMAT"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          "InvoiceDate",
          "GETDATE()",
          "MonthStart",
          "1"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0109",
    "domain": "Ingest and transform data",
    "topic": "T-SQL anti join",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which pattern returns staged ProductIds not found in dbo.Product?",
    "code": "",
    "explanation": "NOT EXISTS expresses an anti-semi join and returns only unmatched staged products.",
    "options": [
      "SELECT s.* FROM StageProduct s WHERE NOT EXISTS (SELECT 1 FROM Product p WHERE p.ProductId=s.ProductId)",
      "INNER JOIN Product and filter p.ProductId IS NOT NULL",
      "CROSS JOIN StageProduct to Product",
      "UNION ALL both tables"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0110",
    "domain": "Ingest and transform data",
    "topic": "T-SQL existence",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You only need to test whether at least one failed pipeline run exists. Which construct best communicates that intent?",
    "code": "",
    "explanation": "EXISTS can stop after finding a qualifying row and directly represents existence.",
    "options": [
      "IF EXISTS (SELECT 1 FROM PipelineRuns WHERE Status='Failed')",
      "SELECT COUNT(*) and always scan every qualifying row",
      "SELECT * INTO a new table",
      "MERGE the PipelineRuns table"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0111",
    "domain": "Ingest and transform data",
    "topic": "T-SQL SCD2",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange the transaction steps for applying SCD Type 2 changes.",
    "code": "",
    "explanation": "The transaction ensures the expire-and-insert sequence is applied atomically.",
    "options": [
      "Start a transaction",
      "Identify changed current dimension rows",
      "Expire changed current rows",
      "Insert replacement current versions",
      "Insert brand-new business keys",
      "Validate and commit the transaction"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "DP7U-0112",
    "domain": "Ingest and transform data",
    "topic": "T-SQL transactions",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two practices make a multi-statement Warehouse load safer?",
    "code": "",
    "explanation": "A transaction plus error handling protects atomicity and restores state after failure.",
    "options": [
      "Use an explicit transaction when statements must succeed or fail together",
      "Use TRY/CATCH with rollback on failure where supported",
      "Commit after every row",
      "Ignore errors and advance the watermark",
      "Run all statements under a shared end-user account"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0113",
    "domain": "Ingest and transform data",
    "topic": "T-SQL CTAS",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A transformation creates a large replacement table from a set-based query. Which pattern is preferable to hundreds of thousands of singleton INSERT statements?",
    "code": "",
    "explanation": "Set-based CTAS or INSERT...SELECT avoids per-row statement overhead.",
    "options": [
      "CTAS or INSERT...SELECT",
      "One INSERT per source row",
      "A cursor that commits each row",
      "Export to a spreadsheet first"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0114",
    "domain": "Monitor and optimize",
    "topic": "Warehouse loading",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A load issues 500,000 consecutive singleton INSERT statements and performs poorly. What should you recommend?",
    "code": "",
    "explanation": "Batch and set-based ingestion dramatically reduce statement and transaction overhead.",
    "options": [
      "Batch rows and use a set-based or high-throughput load method",
      "Create one pipeline per row",
      "Add a sensitivity label per inserted row",
      "Run a KQL top operator before each INSERT"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0115",
    "domain": "Ingest and transform data",
    "topic": "T-SQL CTE",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "What is the primary purpose of a common table expression in a nonrecursive query?",
    "code": "",
    "explanation": "A CTE is a named query expression scoped to the statement that follows it.",
    "options": [
      "Name an intermediate result for use by the immediately following statement",
      "Persist data permanently across sessions",
      "Create a Power BI semantic model",
      "Change the Warehouse capacity"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0116",
    "domain": "Ingest and transform data",
    "topic": "T-SQL JSON",
    "type": "dropdown",
    "difficulty": "Expert",
    "prompt": "Complete the query that expands a JSON array of line items into rows.",
    "code": "SELECT o.OrderId, j.ProductId, j.Quantity\nFROM dbo.RawOrders o\nCROSS APPLY [1](o.ItemsJson)\nWITH (\n ProductId int '$.productId',\n Quantity int '$.quantity'\n) AS [2]\nWHERE j.Quantity [3] 0;",
    "explanation": "OPENJSON expands array elements and WITH maps properties to typed columns.",
    "slots": [
      {
        "label": "[1]",
        "options": [
          "OPENJSON",
          "JSON_VALUE",
          "JSON_QUERY",
          "FOR JSON"
        ],
        "answer": 0
      },
      {
        "label": "[2]",
        "options": [
          "j",
          "o",
          "x.value",
          "ItemsJson"
        ],
        "answer": 0
      },
      {
        "label": "[3]",
        "options": [
          ">",
          "<",
          "=",
          "IS"
        ],
        "answer": 0
      }
    ]
  },
  {
    "id": "DP7U-0117",
    "domain": "Ingest and transform data",
    "topic": "T-SQL JSON scalar",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a single scalar property at path $.customer.tier from a JSON string. Which function is appropriate?",
    "code": "",
    "explanation": "JSON_VALUE extracts a scalar value from JSON text.",
    "options": [
      "JSON_VALUE(Payload,'$.customer.tier')",
      "JSON_QUERY(Payload,'$.customer.tier') for every scalar",
      "OPENJSON without a FROM clause",
      "FOR JSON PATH"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0118",
    "domain": "Ingest and transform data",
    "topic": "T-SQL JSON object",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need the JSON object at path $.customer rather than a scalar. Which function is appropriate?",
    "code": "",
    "explanation": "JSON_QUERY returns an object or array as JSON text.",
    "options": [
      "JSON_QUERY(Payload,'$.customer')",
      "JSON_VALUE(Payload,'$.customer')",
      "ISJSON(Payload,'$.customer')",
      "STRING_SPLIT(Payload,'.')"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0119",
    "domain": "Ingest and transform data",
    "topic": "T-SQL duplicate prevention",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A stored procedure may be retried after a timeout. Which design best prevents duplicate fact rows?",
    "code": "",
    "explanation": "Idempotent key-based logic makes retries produce the same target state.",
    "options": [
      "Use an idempotent key-based MERGE or equivalent update/insert pattern within a transaction",
      "Append every retry without checking keys",
      "Generate a random business key on every run",
      "Advance the watermark before the load begins"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0120",
    "domain": "Ingest and transform data",
    "topic": "T-SQL watermark",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange the safest SQL watermark workflow.",
    "code": "",
    "explanation": "Capturing both bounds and advancing only after successful validation prevents gaps and duplicate windows.",
    "options": [
      "Read the last successful watermark",
      "Capture an upper-bound watermark for the current run",
      "Extract the half-open source window",
      "Stage and validate the extracted rows",
      "Apply the target merge",
      "Record counts and advance the watermark only after success"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "DP7U-0121",
    "domain": "Ingest and transform data",
    "topic": "T-SQL slowly changing dimensions",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Which column combination most directly identifies the single active SCD Type 2 record for a business key?",
    "code": "",
    "explanation": "The business key identifies the entity, and IsCurrent identifies its active version.",
    "options": [
      "BusinessKey plus IsCurrent=true",
      "SurrogateKey only without business key",
      "RowHash only",
      "LoadRunId only"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0122",
    "domain": "Ingest and transform data",
    "topic": "T-SQL data validation",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two checks are most useful before publishing a newly loaded fact partition?",
    "code": "",
    "explanation": "Reconciliation counts and rule-based validation establish completeness and quality.",
    "options": [
      "Compare source, staged, rejected, and loaded row counts",
      "Verify required keys and measures meet null/validity rules",
      "Only verify that the procedure returned without throwing",
      "Delete audit logs to reduce clutter",
      "Grant report users write access for validation"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0123",
    "domain": "Monitor and optimize",
    "topic": "T-SQL query tuning",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A query joins large tables and returns only 0.1% of rows. Which rewrite is generally worth evaluating first?",
    "code": "",
    "explanation": "Early selective predicates and narrow projection reduce intermediate data volume.",
    "options": [
      "Apply selective filters as early as logically possible and project only needed columns",
      "Select every column and filter in the report",
      "Wrap indexed/filter columns in unnecessary functions",
      "Replace the join with a Cartesian product"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0124",
    "domain": "Ingest and transform data",
    "topic": "T-SQL set operators",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to combine two compatible result sets while retaining duplicates. Which operator should you use?",
    "code": "",
    "explanation": "UNION ALL concatenates rows without duplicate elimination.",
    "options": [
      "UNION ALL",
      "UNION",
      "INTERSECT",
      "EXCEPT"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0125",
    "domain": "Ingest and transform data",
    "topic": "T-SQL set operators",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need only distinct keys present in both QueryA and QueryB. Which operator is appropriate?",
    "code": "",
    "explanation": "INTERSECT returns distinct rows common to both inputs.",
    "options": [
      "INTERSECT",
      "UNION ALL",
      "EXCEPT",
      "CROSS APPLY"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0126",
    "domain": "Ingest and transform data",
    "topic": "T-SQL set operators",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need keys returned by QueryA that are absent from QueryB. Which operator expresses this directly?",
    "code": "",
    "explanation": "EXCEPT returns distinct rows from the first input not found in the second.",
    "options": [
      "EXCEPT",
      "INTERSECT",
      "UNION ALL",
      "PIVOT"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0127",
    "domain": "Ingest and transform data",
    "topic": "T-SQL pivot",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need one output column per Status value and a count of jobs in each status. Which relational operator is designed for this rotation?",
    "code": "",
    "explanation": "PIVOT rotates row values into columns while applying an aggregation.",
    "options": [
      "PIVOT",
      "UNPIVOT",
      "MERGE",
      "APPLY"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0128",
    "domain": "Ingest and transform data",
    "topic": "T-SQL unpivot",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A wide monthly table has JanAmount, FebAmount, and MarAmount columns that must become MonthName and Amount rows. Which operator is designed for this?",
    "code": "",
    "explanation": "UNPIVOT converts columns into row values.",
    "options": [
      "UNPIVOT",
      "PIVOT",
      "ROLLUP",
      "MERGE"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0129",
    "domain": "Ingest and transform data",
    "topic": "T-SQL grouping sets",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need totals by Region, by Channel, by (Region,Channel), and a grand total in one aggregation. Which feature is appropriate?",
    "code": "",
    "explanation": "GROUPING SETS calculates multiple grouping combinations in one grouped query.",
    "options": [
      "GROUPING SETS",
      "A scalar subquery per row",
      "ROW_NUMBER",
      "STRING_AGG"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0130",
    "domain": "Ingest and transform data",
    "topic": "T-SQL string aggregation",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need a comma-separated list of ErrorCode values per PipelineRunId. Which aggregate is appropriate?",
    "code": "",
    "explanation": "STRING_AGG concatenates values across rows within each group.",
    "options": [
      "STRING_AGG(ErrorCode,',')",
      "CONCAT(ErrorCode,',')",
      "STRING_SPLIT(ErrorCode,',')",
      "FORMAT(ErrorCode,',')"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0131",
    "domain": "Ingest and transform data",
    "topic": "T-SQL apply",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A table-valued expression must be evaluated for each row of a parent query, while parent rows with no child result must still be retained. Which operator is appropriate?",
    "code": "",
    "explanation": "OUTER APPLY preserves the outer row even when the applied expression returns no rows.",
    "options": [
      "OUTER APPLY",
      "CROSS APPLY",
      "INNER JOIN without a predicate",
      "CROSS JOIN"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0132",
    "domain": "Monitor and optimize",
    "topic": "T-SQL error diagnosis",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A query fails with “Conversion failed when converting the varchar value to int” because a source column contains mixed values. What should you do first?",
    "code": "",
    "explanation": "The problem is invalid data conversion; profile, validate, and safely cast or reject invalid rows.",
    "options": [
      "Profile the invalid values and use controlled TRY_CAST/validation rather than hiding the issue",
      "Increase Warehouse capacity",
      "Run OPTIMIZE on the table",
      "Change workspace role to Admin"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0133",
    "domain": "Monitor and optimize",
    "topic": "T-SQL error diagnosis",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A MERGE fails because the source contains duplicate BusinessKey values matching one target row. What is the correct remediation?",
    "code": "",
    "explanation": "The merge source must be unique at the match-key grain to avoid multiple matches.",
    "options": [
      "Deduplicate the source deterministically before MERGE",
      "Add more target duplicates",
      "Disable transactions",
      "Replace equality with a non-equality join"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0134",
    "domain": "Monitor and optimize",
    "topic": "Delta maintenance",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Delta table has accumulated 28,000 small active files. Storage cleanup is not required. Which operation directly addresses the read overhead?",
    "code": "",
    "explanation": "OPTIMIZE compacts active small files into fewer larger files.",
    "options": [
      "OPTIMIZE",
      "VACUUM",
      "RESTORE",
      "DESCRIBE HISTORY"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0135",
    "domain": "Monitor and optimize",
    "topic": "Delta maintenance",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Obsolete unreferenced Delta files are older than the approved retention window and no job needs them. Which operation reclaims the storage?",
    "code": "",
    "explanation": "VACUUM removes unreferenced files older than the retention threshold.",
    "options": [
      "VACUUM",
      "OPTIMIZE",
      "ZORDER",
      "MERGE"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0136",
    "domain": "Monitor and optimize",
    "topic": "Delta time travel",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two statements about aggressive VACUUM are correct?",
    "code": "",
    "explanation": "VACUUM affects historical file availability and must be planned around retention and active workloads.",
    "options": [
      "It can remove files required for older time-travel versions",
      "It should respect active readers and approved retention requirements",
      "It compacts the current active files",
      "It creates a Warehouse endpoint",
      "It updates changed dimension rows"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0137",
    "domain": "Monitor and optimize",
    "topic": "V-Order",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Gold Delta table is written nightly and scanned repeatedly by SQL, Spark, and Direct Lake consumers. Which file optimization should you evaluate?",
    "code": "",
    "explanation": "V-Order optimizes Parquet layout for read-heavy cross-engine analytics.",
    "options": [
      "V-Order",
      "Convert to newline-delimited JSON",
      "Disable all maintenance",
      "Write one file per row"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0138",
    "domain": "Monitor and optimize",
    "topic": "Z-Order and clustering",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Delta table on an older compatible runtime is frequently filtered by OrderDate and Region. You need better file skipping without adding partitions. Which maintenance pattern is appropriate to evaluate?",
    "code": "",
    "explanation": "Z-Order colocates related values and can improve file skipping for frequently filtered columns.",
    "options": [
      "OPTIMIZE ... ZORDER BY (OrderDate, Region)",
      "VACUUM RETAIN 0 HOURS",
      "CROSS JOIN the filter table",
      "Collect statistics in a browser"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0139",
    "domain": "Monitor and optimize",
    "topic": "Liquid clustering",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "On a current Fabric runtime, a large table needs flexible clustering columns that can be changed and incrementally optimized. Which layout strategy should you evaluate before adopting a new Z-Order design?",
    "code": "",
    "explanation": "Current Fabric guidance favors liquid clustering for flexible, incremental data layout on supported runtimes.",
    "options": [
      "Liquid clustering",
      "One partition per CustomerId",
      "CSV folder hierarchy",
      "A Power BI bookmark"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0140",
    "domain": "Implement and manage analytics",
    "topic": "Delta concurrency",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Two notebooks concurrently update overlapping rows in the same Delta table. One transaction fails instead of silently corrupting data. Which mechanism explains this behavior?",
    "code": "",
    "explanation": "Delta validates concurrent commits and fails conflicting transactions under optimistic concurrency control.",
    "options": [
      "Optimistic concurrency control",
      "Eventhouse caching",
      "Power BI RLS",
      "A OneLake shortcut"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0141",
    "domain": "Implement and manage analytics",
    "topic": "Lakehouse choice",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Semi-structured data is written by Spark and must be available through Spark and a SQL analytics endpoint. Which primary store is most appropriate?",
    "code": "",
    "explanation": "A Lakehouse supports Spark-managed files and Delta tables with SQL analytics access.",
    "options": [
      "Lakehouse",
      "Eventstream only",
      "A local CSV workbook",
      "Datamart"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0142",
    "domain": "Implement and manage analytics",
    "topic": "Warehouse choice",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A finance team primarily uses T-SQL, relational schemas, stored procedures, and governed BI serving. Which store is generally the better fit?",
    "code": "",
    "explanation": "Warehouse is optimized for relational T-SQL analytics and governed BI serving.",
    "options": [
      "Warehouse",
      "Eventstream",
      "Notebook-only Files folder",
      "A browser localStorage database"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0143",
    "domain": "Implement and manage analytics",
    "topic": "OneLake shortcuts",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A team must analyze an existing Delta table in another supported storage location without copying the data. Which Fabric feature should you use?",
    "code": "",
    "explanation": "A shortcut references data in place and avoids creating another physical copy.",
    "options": [
      "OneLake shortcut",
      "Dataflow Gen2 append into a duplicate table",
      "Screenshot export",
      "Power BI bookmark"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0144",
    "domain": "Implement and manage analytics",
    "topic": "Shortcut placement",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A OneLake shortcut target is a Delta table and should be automatically discoverable as a table. Where should the shortcut be created?",
    "code": "",
    "explanation": "Delta-table shortcuts belong in the Tables section for table discovery.",
    "options": [
      "In the Lakehouse Tables section",
      "Only in a report visual",
      "Inside a notebook markdown cell",
      "In the semantic model measure list"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0145",
    "domain": "Implement and manage analytics",
    "topic": "Shortcut placement",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A shortcut target is a folder of raw JSON files rather than a Delta table. Where should it normally be created?",
    "code": "",
    "explanation": "Raw file and folder shortcuts belong in the Files section and can be read by Spark.",
    "options": [
      "In the Lakehouse Files section",
      "In the Warehouse stored procedure folder",
      "As a report measure",
      "As a workspace role"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0146",
    "domain": "Ingest and transform data",
    "topic": "Pipeline watermark",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange a production-grade incremental pipeline using a LastModifiedDateTime watermark.",
    "code": "",
    "explanation": "The upper bound stabilizes the source window, and the watermark advances only after validated success.",
    "options": [
      "Read the last successful watermark from the control table",
      "Capture a current upper bound for the run",
      "Copy the half-open source window to Bronze",
      "Validate counts, schema, and rejected rows",
      "Run the idempotent Silver merge",
      "Update the watermark and audit log only after success"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "DP7U-0147",
    "domain": "Ingest and transform data",
    "topic": "Pipeline parameters",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two values should usually be parameterized instead of hard-coded in every pipeline activity?",
    "code": "",
    "explanation": "Environment and source-object values commonly vary and should be driven by parameters or metadata.",
    "options": [
      "Environment-specific connection or workspace values",
      "Source table or folder names used by a metadata-driven loop",
      "A fixed literal explaining the business rule",
      "The word Success in an audit record",
      "The number 1 in a row-count expression"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0148",
    "domain": "Monitor and optimize",
    "topic": "Pipeline troubleshooting",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A pipeline fails in a Copy activity after the source password is rotated. What should you inspect first?",
    "code": "",
    "explanation": "The failure follows credential rotation, so connection authentication is the first check.",
    "options": [
      "The connection credential and authentication error in the failed activity output",
      "The report color theme",
      "The Lakehouse V-Order setting",
      "The semantic model display folder"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0149",
    "domain": "Monitor and optimize",
    "topic": "Pipeline retries",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two failures are reasonable candidates for limited retry logic?",
    "code": "",
    "explanation": "Retries help transient failures; deterministic data or code defects require correction, not repeated execution.",
    "options": [
      "A transient network timeout",
      "A temporary source throttling response",
      "A deterministic schema mismatch",
      "A missing mandatory business key in every row",
      "A syntax error in notebook code"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0150",
    "domain": "Monitor and optimize",
    "topic": "Pipeline dependencies",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Gold activity must run only after both CustomerSilver and ProductSilver succeed. Which orchestration design is appropriate?",
    "code": "",
    "explanation": "Explicit success dependencies enforce the required fan-in before Gold processing.",
    "options": [
      "Configure success dependencies from both Silver activities to Gold",
      "Start Gold in parallel and hope the tables exist",
      "Use a browser refresh event",
      "Grant Gold workspace Admin"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0151",
    "domain": "Monitor and optimize",
    "topic": "Pipeline audit logging",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two values are essential in a reusable pipeline audit record?",
    "code": "",
    "explanation": "Identity, timing, status, counts, and error information support traceability and troubleshooting.",
    "options": [
      "Run identifier and item/activity name",
      "Status, start/end time, counts, and error details",
      "The user interface theme",
      "Every report visual coordinate",
      "A random number unrelated to the run"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0152",
    "domain": "Ingest and transform data",
    "topic": "Dataflow Gen2",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Business analysts need repeatable low-code transformations with Power Query and a managed destination. Which Fabric item is appropriate?",
    "code": "",
    "explanation": "Dataflow Gen2 provides Power Query-based ingestion and transformation with Fabric destinations.",
    "options": [
      "Dataflow Gen2",
      "Spark job definition only",
      "Eventstream destination rule only",
      "Workspace domain"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0153",
    "domain": "Monitor and optimize",
    "topic": "Dataflow Gen2 errors",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Dataflow Gen2 refresh starts failing after an upstream column is renamed. What should you inspect first?",
    "code": "",
    "explanation": "A schema change commonly breaks a Power Query step that references the previous column name.",
    "options": [
      "The step that references the old column and the refresh error details",
      "Warehouse V-Order",
      "Eventhouse cache size",
      "Git branch permissions"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0154",
    "domain": "Ingest and transform data",
    "topic": "Notebook parameters",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "One notebook must run for Dev, Test, and Prod without editing code. What design should you use?",
    "code": "",
    "explanation": "Parameters make the notebook reusable and support controlled promotion across environments.",
    "options": [
      "Parameterize environment-dependent values and pass them from orchestration",
      "Hard-code all three paths in separate copied notebooks",
      "Read the environment from a report title",
      "Use a random workspace ID"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0155",
    "domain": "Implement and manage analytics",
    "topic": "Git integration",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A team needs source-controlled Fabric item definitions, branching, and pull-request review. Which lifecycle capability should be configured?",
    "code": "",
    "explanation": "Git integration connects supported Fabric item definitions to version control workflows.",
    "options": [
      "Git integration",
      "A KQL retention policy",
      "A Spark broadcast hint",
      "A report bookmark"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0156",
    "domain": "Implement and manage analytics",
    "topic": "Deployment pipelines",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to promote supported Fabric content from Development to Test to Production while applying environment-specific rules. Which feature is designed for this?",
    "code": "",
    "explanation": "Deployment pipelines support staged promotion and deployment rules between environments.",
    "options": [
      "Deployment pipelines",
      "Eventstream",
      "OneLake file shortcut",
      "Notebook display()"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0157",
    "domain": "Implement and manage analytics",
    "topic": "Workspace roles",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A user must view and consume reports but should not create or modify workspace items. Which workspace role best follows least privilege?",
    "code": "",
    "explanation": "Viewer provides consumption access without item-authoring capabilities.",
    "options": [
      "Viewer",
      "Admin",
      "Member",
      "Contributor"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0158",
    "domain": "Implement and manage analytics",
    "topic": "Workspace roles",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A data engineer must create and edit items but should not manage workspace membership or settings. Which role is generally appropriate?",
    "code": "",
    "explanation": "Contributor supports item creation and editing without full workspace administration.",
    "options": [
      "Contributor",
      "Admin",
      "Viewer",
      "No role plus public sharing"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0159",
    "domain": "Implement and manage analytics",
    "topic": "Row-level security",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Regional managers must see only rows for their assigned region in a semantic model. Which control is designed for this?",
    "code": "",
    "explanation": "RLS filters model rows according to user or role context.",
    "options": [
      "Row-level security",
      "V-Order",
      "VACUUM",
      "Eventstream routing"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0160",
    "domain": "Implement and manage analytics",
    "topic": "Column security",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Analysts may query a table but must not access the Salary column at all. Which control is more appropriate than simply masking displayed values?",
    "code": "",
    "explanation": "Column/object-level security can deny access to the sensitive field rather than only altering its displayed value.",
    "options": [
      "Column-level or object-level security",
      "V-Order",
      "A caching policy",
      "A retry policy"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0161",
    "domain": "Implement and manage analytics",
    "topic": "Dynamic data masking",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Support users may query a table but should see masked phone numbers by default, while privileged users can see the original values. Which feature fits this display requirement?",
    "code": "",
    "explanation": "Dynamic masking obfuscates query results for nonprivileged users without changing stored values.",
    "options": [
      "Dynamic data masking",
      "OPTIMIZE",
      "A OneLake shortcut",
      "Spark repartition"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0162",
    "domain": "Implement and manage analytics",
    "topic": "Sensitivity labels",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to classify a Fabric item as highly confidential and propagate governance metadata to supported downstream experiences. What should you apply?",
    "code": "",
    "explanation": "Sensitivity labels classify and help govern supported data and analytics items.",
    "options": [
      "A sensitivity label",
      "A broadcast hint",
      "A KQL bin expression",
      "A notebook cache"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0163",
    "domain": "Implement and manage analytics",
    "topic": "Least privilege",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two actions follow least privilege for a temporary consultant?",
    "code": "",
    "explanation": "Minimum required access plus timely review/removal reduces unnecessary privilege.",
    "options": [
      "Grant only the minimum item/workspace access required",
      "Set an access review or removal date",
      "Make the consultant Admin to avoid support tickets",
      "Share a common service account password",
      "Export all sensitive data to an unmanaged spreadsheet"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0164",
    "domain": "Implement and manage analytics",
    "topic": "Secret management",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Where should a production source password not be stored?",
    "code": "",
    "explanation": "Secrets must not be embedded in source code or committed client-side files.",
    "options": [
      "In a notebook text cell or committed JavaScript file",
      "In a managed connection or approved secret store",
      "In a credential object referenced by the connection",
      "In a protected deployment configuration"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0165",
    "domain": "Monitor and optimize",
    "topic": "Capacity monitoring",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Multiple unrelated workloads slow down simultaneously and throttling indicators appear. What should you inspect?",
    "code": "",
    "explanation": "Capacity metrics reveal cross-workload consumption, saturation, and throttling signals.",
    "options": [
      "Fabric capacity metrics and workload consumption",
      "Only the color of the report theme",
      "The row order in one CSV file",
      "The name of the Git branch"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0166",
    "domain": "Monitor and optimize",
    "topic": "Spark monitoring",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A notebook is slow because of a suspected shuffle and skew issue. Which diagnostic view is most useful?",
    "code": "",
    "explanation": "Spark UI exposes task duration, shuffle volume, skew, spills, and physical plans.",
    "options": [
      "Spark UI stages, tasks, SQL plan, and shuffle metrics",
      "Power BI mobile layout",
      "Workspace sensitivity label list",
      "A screenshot of the landing page"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0167",
    "domain": "Monitor and optimize",
    "topic": "Warehouse monitoring",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A Warehouse query has regressed after data growth. What should you inspect before scaling capacity?",
    "code": "",
    "explanation": "Root-cause tuning starts with execution behavior and workload evidence, not immediate scaling.",
    "options": [
      "Query plan, scanned data, filters, joins, and workload history",
      "Only the report title",
      "The Eventhouse retention policy",
      "The notebook markdown font"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0168",
    "domain": "Ingest and transform data",
    "topic": "Eventstream routing",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A real-time stream must be filtered and routed simultaneously to an Eventhouse and an alerting destination. Which item is designed for this?",
    "code": "",
    "explanation": "Eventstream ingests, transforms, and routes real-time events to supported destinations.",
    "options": [
      "Eventstream",
      "Warehouse stored procedure",
      "Git branch",
      "Lakehouse maintenance job"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0169",
    "domain": "Ingest and transform data",
    "topic": "Eventstream transformation",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to discard telemetry rows below a quality threshold before they reach the destination. Where should the filter be applied to reduce downstream volume?",
    "code": "",
    "explanation": "Filtering in the stream path reduces downstream ingestion and processing work.",
    "options": [
      "In the Eventstream transformation path before the destination",
      "After exporting every raw event to Excel",
      "Only in the final dashboard visual",
      "By increasing the cache window"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0170",
    "domain": "Monitor and optimize",
    "topic": "Eventstream troubleshooting",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "An Eventstream shows incoming events but the Eventhouse destination receives none. What should you inspect first?",
    "code": "",
    "explanation": "The source is active, so inspect routing, transformation, mapping, destination, and error telemetry.",
    "options": [
      "Destination configuration, schema mapping, transformation filters, and runtime errors",
      "The Spark shuffle partition count",
      "The report page background",
      "The Git pull-request title"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0171",
    "domain": "Implement and manage analytics",
    "topic": "Eventhouse choice",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "Operations needs low-latency exploration of high-volume time-series and log data using KQL. Which store is the best fit?",
    "code": "",
    "explanation": "Eventhouse is designed for high-volume event data and KQL-based real-time analytics.",
    "options": [
      "Eventhouse",
      "Warehouse only",
      "A local Access database",
      "A static report bookmark"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0172",
    "domain": "Monitor and optimize",
    "topic": "Eventhouse hot cache",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "An Eventhouse keeps ten years of data, but cache utilization is driving compute size because too much history is hot. What should you tune?",
    "code": "",
    "explanation": "Hot-cache scope directly influences cached volume and Eventhouse compute requirements.",
    "options": [
      "The caching policy hot window",
      "The retention policy to ten minutes without business approval",
      "Spark coalesce",
      "Power BI row-level security"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0173",
    "domain": "Implement and manage analytics",
    "topic": "Direct Lake",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A semantic model should read OneLake data with minimal import-copy overhead while preserving high analytical performance. Which storage mode should you evaluate?",
    "code": "",
    "explanation": "Direct Lake is designed to read Fabric data in OneLake without a traditional full import copy.",
    "options": [
      "Direct Lake",
      "DirectQuery to a local CSV",
      "Manual Excel import",
      "A browser cache"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0174",
    "domain": "Monitor and optimize",
    "topic": "Direct Lake optimization",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two table-maintenance practices commonly benefit read-heavy Direct Lake tables?",
    "code": "",
    "explanation": "Efficient file sizes and V-Ordered Parquet layout improve repeated analytical scans.",
    "options": [
      "Use appropriate file compaction",
      "Use V-Order where the workload benefits",
      "Create one tiny file per row",
      "Disable all optimization permanently",
      "Store measures in raw JSON strings"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0175",
    "domain": "Implement and manage analytics",
    "topic": "Medallion architecture",
    "type": "match",
    "difficulty": "Expert",
    "prompt": "Match each layer to its primary purpose.",
    "code": "",
    "explanation": "The layers separate replayable raw data, conformed transformations, business-ready serving, and operational control.",
    "left": [
      "Bronze",
      "Silver",
      "Gold",
      "Audit/control"
    ],
    "right": [
      "Retained raw source-aligned data and ingestion metadata",
      "Validated, standardized, deduplicated, and conformed data",
      "Business-ready facts, dimensions, aggregates, and KPIs",
      "Run status, watermarks, counts, errors, and operational lineage"
    ],
    "answer": {
      "Bronze": "Retained raw source-aligned data and ingestion metadata",
      "Silver": "Validated, standardized, deduplicated, and conformed data",
      "Gold": "Business-ready facts, dimensions, aggregates, and KPIs",
      "Audit/control": "Run status, watermarks, counts, errors, and operational lineage"
    }
  },
  {
    "id": "DP7U-0176",
    "domain": "Implement and manage analytics",
    "topic": "Fabric workload matching",
    "type": "match",
    "difficulty": "Expert",
    "prompt": "Match each Fabric item to the workload it best represents.",
    "code": "",
    "explanation": "Each Fabric item serves a distinct orchestration, transformation, storage, or query workload.",
    "left": [
      "Pipeline",
      "Dataflow Gen2",
      "Notebook",
      "Warehouse",
      "Eventhouse"
    ],
    "right": [
      "Orchestration and movement across activities",
      "Low-code Power Query transformation",
      "Code-first Spark transformation and analysis",
      "Relational T-SQL analytics serving",
      "KQL-based event and time-series analytics"
    ],
    "answer": {
      "Pipeline": "Orchestration and movement across activities",
      "Dataflow Gen2": "Low-code Power Query transformation",
      "Notebook": "Code-first Spark transformation and analysis",
      "Warehouse": "Relational T-SQL analytics serving",
      "Eventhouse": "KQL-based event and time-series analytics"
    }
  },
  {
    "id": "DP7U-0177",
    "domain": "Monitor and optimize",
    "topic": "Troubleshooting order",
    "type": "order",
    "difficulty": "Expert",
    "prompt": "Arrange a disciplined troubleshooting workflow for a failed production load.",
    "code": "",
    "explanation": "Evidence-led diagnosis should precede changes, followed by controlled validation and prevention documentation.",
    "options": [
      "Identify the failed run and exact activity",
      "Read the error details and dependency outputs",
      "Compare source window, parameters, credentials, schema, and counts",
      "Reproduce safely in a controlled environment",
      "Apply the smallest targeted fix",
      "Rerun, validate results, and document prevention actions"
    ],
    "answer": [
      0,
      1,
      2,
      3,
      4,
      5
    ]
  },
  {
    "id": "DP7U-0178",
    "domain": "Implement and manage analytics",
    "topic": "Deployment validation",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "Which two checks should be completed before promoting a data engineering release to Production?",
    "code": "",
    "explanation": "Configuration and data validation reduce deployment risk and catch environment-specific issues.",
    "options": [
      "Validate environment-specific connections and parameters",
      "Run representative data-quality and reconciliation tests",
      "Grant all users Admin temporarily",
      "Delete the previous version immediately",
      "Disable monitoring to reduce noise"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0179",
    "domain": "Implement and manage analytics",
    "topic": "Domain settings",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "An enterprise wants analytics workspaces organized and governed by business area such as Finance and Supply Chain. Which Fabric concept supports this organization?",
    "code": "",
    "explanation": "Domains organize Fabric content and governance around business areas.",
    "options": [
      "Domains",
      "Spark partitions",
      "KQL materialized views",
      "Delta VACUUM"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0180",
    "domain": "Implement and manage analytics",
    "topic": "OneLake workspace settings",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "You need to control workspace-level behavior related to OneLake access and data availability. Where should this be configured?",
    "code": "",
    "explanation": "OneLake workspace behavior is configured through the relevant Fabric workspace settings.",
    "options": [
      "Fabric workspace OneLake settings",
      "Inside every Power BI visual",
      "In a KQL summarize operator",
      "In a local browser cookie only"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0181",
    "domain": "Implement and manage analytics",
    "topic": "Spark workspace settings",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A team needs a workspace-wide default Spark configuration for supported sessions. Where should it be managed?",
    "code": "",
    "explanation": "Spark workspace/environment configuration centralizes supported runtime settings.",
    "options": [
      "Spark workspace settings or environment configuration",
      "In a report tooltip",
      "In an Eventhouse retention policy",
      "In a Warehouse row-level security role"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0182",
    "domain": "Implement and manage analytics",
    "topic": "Airflow workspace settings",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A solution uses Apache Airflow integration and needs workspace-level configuration. Which current DP-700 objective area does this belong to?",
    "code": "",
    "explanation": "The current skills outline includes Apache Airflow workspace settings under workspace configuration.",
    "options": [
      "Configure Microsoft Fabric workspace settings",
      "Optimize a Power BI visual",
      "Define KQL cache policy only",
      "Create an SCD2 row"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0183",
    "domain": "Monitor and optimize",
    "topic": "Shortcut troubleshooting",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A user sees a shortcut but receives access-denied errors when reading its target. Which two permission areas should be checked?",
    "code": "",
    "explanation": "Shortcut visibility does not automatically satisfy all permissions in both the consuming and target contexts.",
    "options": [
      "Access through the consuming Fabric item/workspace",
      "Permissions required by the shortcut target system or location",
      "Spark shuffle partitions",
      "V-Order configuration",
      "Report theme permissions"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0184",
    "domain": "Monitor and optimize",
    "topic": "Schema drift",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A source adds a new column and the Bronze load succeeds, but a Silver notebook fails while selecting a fixed list of expected columns. What is the best first response?",
    "code": "",
    "explanation": "The failure is caused by schema expectations; handle drift deliberately and validate required/optional columns.",
    "options": [
      "Inspect the schema-drift contract and update controlled selection/validation logic",
      "Increase Eventhouse cache",
      "Run VACUUM",
      "Change every user to Admin"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0185",
    "domain": "Monitor and optimize",
    "topic": "Missing rows",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A pipeline succeeds but the target is missing exactly one hour of records. What should you inspect first?",
    "code": "",
    "explanation": "A precise time gap strongly suggests window-boundary or time-zone logic.",
    "options": [
      "Lower/upper watermark values, source time-zone handling, and the extracted half-open window",
      "The report background color",
      "The number of semantic model measures",
      "The Eventhouse cache policy"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0186",
    "domain": "Monitor and optimize",
    "topic": "Duplicate rows",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A retry doubles rows in an append-only Silver table. Which design defect is most likely?",
    "code": "",
    "explanation": "Retries duplicate data when the target logic blindly appends rather than applying idempotent keys.",
    "options": [
      "The load is not idempotent and lacks key-based deduplication or MERGE logic",
      "V-Order is enabled",
      "The workspace uses a domain",
      "The report uses Direct Lake"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0187",
    "domain": "Implement and manage analytics",
    "topic": "Case study architecture",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "A manufacturer receives machine events continuously and ERP receipts hourly. Operations needs near-real-time alerts; planners need governed historical trends. Which architecture best fits?",
    "code": "",
    "explanation": "The design separates real-time event analytics from governed historical engineering and serving.",
    "options": [
      "Eventstream to Eventhouse for real-time analysis, plus governed Lakehouse/Warehouse layers for historical analytics",
      "Send all data directly to separate reports with duplicated transformations",
      "Store only screenshots of alerts",
      "Use one overwritten CSV for every workload"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0188",
    "domain": "Implement and manage analytics",
    "topic": "Case study security",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A healthcare analytics solution contains patient identifiers. Analysts need aggregates but not direct identifiers. Which two controls are most appropriate?",
    "code": "",
    "explanation": "Column restrictions and curated aggregate access reduce exposure while supporting analytical needs.",
    "options": [
      "Restrict identifier columns with column/object-level controls",
      "Expose curated aggregate tables or models with least-privilege access",
      "Make all analysts workspace Admin",
      "Email raw extracts to analysts",
      "Disable audit logging"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  },
  {
    "id": "DP7U-0189",
    "domain": "Ingest and transform data",
    "topic": "Case study incremental load",
    "type": "single",
    "difficulty": "Expert",
    "prompt": "An ERP has no CDC but provides a reliable LastModifiedDateTime. Corrections may arrive two days late. Which design is best?",
    "code": "",
    "explanation": "An overlap captures late corrections, and an idempotent merge prevents duplicate target state.",
    "options": [
      "Use a watermark with a two-day overlap and idempotent key-based merge",
      "Reload only today and ignore older changes",
      "Advance the watermark before extraction",
      "Append every extracted row permanently"
    ],
    "answer": [
      0
    ]
  },
  {
    "id": "DP7U-0190",
    "domain": "Monitor and optimize",
    "topic": "Case study optimization",
    "type": "multi",
    "difficulty": "Expert",
    "prompt": "A Gold Delta table receives frequent small writes and is scanned by Direct Lake throughout the day. Which two actions are most relevant?",
    "code": "",
    "explanation": "Compaction reduces file overhead and V-Order improves read-oriented Parquet layout.",
    "options": [
      "Compact small files on an appropriate schedule",
      "Evaluate V-Order for the read-heavy consumer pattern",
      "Convert the table to one JSON file",
      "Disable Delta transactions",
      "Collect the table to the notebook driver"
    ],
    "answer": [
      0,
      1
    ],
    "select": 2
  }
];
