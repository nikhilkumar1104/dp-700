/*
  Original DP-700-style practice question generator.
  This does not contain copied certification questions or official exam content.
  v6 focuses on deeper variation so practice exams do not feel repetitive.
*/
(function () {
  const topics = [
    {
      topic: "Implement Data Ingestion",
      skill: "Data Factory, Dataflows Gen2, pipelines, incremental loading",
      concepts: [
        "Data Factory pipeline", "Dataflows Gen2 ingestion", "copy activity", "incremental watermark",
        "on-premises gateway connection", "OneLake shortcut", "event-driven ingestion", "parameterized pipeline",
        "API pagination", "file landing zone", "metadata-driven ingestion", "late-arriving source extract"
      ],
      scenarios: [
        "retail point-of-sale files", "bank transaction extracts", "healthcare appointment feeds", "manufacturing telemetry files",
        "e-commerce order events", "supplier purchase receipt updates", "finance trial balance exports", "CRM customer snapshots",
        "IoT sensor batches", "regional sales target spreadsheets"
      ],
      good: [
        "Store source run metadata, including source window, row counts, status, and watermark.",
        "Use parameters for connection, folder, table, and environment values.",
        "Update the watermark only after the load and validation succeed.",
        "Keep raw data available for replay, audit, and reconciliation.",
        "Add retry logic and failure notifications for transient source issues.",
        "Use secure credential handling instead of embedding secrets in code."
      ],
      bad: [
        "Update the watermark before the extraction begins.",
        "Manually copy the latest file into a report folder.",
        "Delete the raw landing files immediately after loading Silver.",
        "Use a single hard-coded path and environment-specific values inside every activity.",
        "Ignore failed rows so that the dashboard refresh always appears successful.",
        "Give all report viewers edit access to ingestion items."
      ]
    },
    {
      topic: "Transform Data",
      skill: "Notebooks, Spark, data preparation, validation",
      concepts: [
        "Spark notebook transformation", "PySpark cleansing", "Dataflow merge", "schema drift handling",
        "deduplication rule", "data quality validation", "partition pruning", "Bronze-to-Silver transformation",
        "slowly changing dimension handling", "surrogate key creation", "null handling", "late-arriving record correction"
      ],
      scenarios: [
        "customer record cleansing", "product category standardization", "ERP and spreadsheet joins", "late-arriving order updates",
        "duplicate invoice removal", "currency conversion preparation", "claim data validation", "supplier classification mapping",
        "machine downtime aggregation", "promotion attribution preparation"
      ],
      good: [
        "Validate schema and data quality before publishing downstream tables.",
        "Use deterministic business keys and repeatable transformation rules.",
        "Separate raw, conformed, and curated logic into clear processing layers.",
        "Capture rejected records and validation metrics for review.",
        "Use Spark for large transformations that exceed single-machine memory.",
        "Design partition and filter logic around common query predicates."
      ],
      bad: [
        "Change column names manually inside each report.",
        "Skip validation because the output is only used by a dashboard.",
        "Overwrite conformed data without retaining run or source lineage.",
        "Assume every incoming file has the same schema forever.",
        "Use local desktop processing for multi-terabyte tables.",
        "Hide rejected records instead of logging the quality issue."
      ]
    },
    {
      topic: "Implement and Manage Analytics Solutions",
      skill: "Lakehouse, Warehouse, Delta tables, optimization",
      concepts: [
        "Lakehouse table", "Warehouse fact table", "Delta table", "semantic model readiness",
        "star schema", "surrogate key", "medallion architecture", "Direct Lake reporting",
        "dimension conformance", "fact table grain", "table maintenance", "curated Gold model"
      ],
      scenarios: [
        "executive revenue reporting", "inventory availability analytics", "customer profitability model", "financial close dashboard",
        "supplier OTIF scorecard", "sales pipeline analytics", "manufacturing schedule adherence", "cash runway reporting",
        "returns trend analysis", "new account win tracking"
      ],
      good: [
        "Define fact table grain before building measures and relationships.",
        "Use curated dimensions and fact tables for consistent reporting.",
        "Keep Gold tables business-ready and governed for analytics consumers.",
        "Optimize Delta tables and file layout when query patterns require it.",
        "Use Warehouse or Lakehouse tables based on workload and serving needs.",
        "Document lineage from source to curated analytics objects."
      ],
      bad: [
        "Build every report directly from raw source files.",
        "Mix raw records, cleansing rules, and final KPIs in a single overwritten table.",
        "Create measures from columns with undefined grain.",
        "Duplicate the same business rule separately in every report.",
        "Ignore table maintenance after frequent small-file writes.",
        "Allow each team to define customer and product dimensions differently."
      ]
    },
    {
      topic: "Monitor and Optimize",
      skill: "Monitoring pipelines, logging, performance tuning, troubleshooting",
      concepts: [
        "pipeline run history", "activity logging", "Spark UI", "query plan analysis",
        "small file compaction", "retry policy", "alerting", "capacity monitoring",
        "failed refresh diagnostics", "data skew investigation", "long-running SQL query", "incremental load reconciliation"
      ],
      scenarios: [
        "slow nightly refresh", "failed ingestion run", "high Spark shuffle", "long-running SQL query",
        "missing rows after incremental load", "capacity throttling alert", "large number of tiny files", "unexpected null values in Silver",
        "report refresh timeout", "pipeline dependency failure"
      ],
      good: [
        "Review run history, activity output, error details, and dependency timing.",
        "Compare source counts, loaded counts, rejected counts, and watermark windows.",
        "Inspect Spark execution details when shuffles, skew, or memory pressure appear.",
        "Tune file layout, table design, and filters based on actual query patterns.",
        "Set alerts for failed or delayed critical processing runs.",
        "Document the root cause and prevention action after recovery."
      ],
      bad: [
        "Disable monitoring to reduce the amount of log data.",
        "Rerun the pipeline repeatedly without checking the failed activity output.",
        "Add more report visuals to fix a slow query plan.",
        "Delete historical run logs before troubleshooting the incident.",
        "Assume a capacity issue without checking refresh and execution metrics.",
        "Update production transformations without a controlled validation run."
      ]
    },
    {
      topic: "Security and Governance",
      skill: "RBAC, workspace permissions, data security, compliance",
      concepts: [
        "workspace role", "item permission", "row-level security", "column masking",
        "sensitivity label", "data lineage", "least privilege", "audit log",
        "privileged access review", "secure sharing", "compliance reporting", "restricted financial data"
      ],
      scenarios: [
        "finance salary data", "healthcare compliance data", "banking customer records", "supplier confidential pricing",
        "admin access review", "sales territory reporting", "masked PII analytics", "external consultant access",
        "regional HR reporting", "executive-only margin analytics"
      ],
      good: [
        "Grant the minimum role and item permission required for the user's job.",
        "Apply row-level or column-level protection where sensitive data is exposed.",
        "Use audit logs and lineage to understand access and data movement.",
        "Separate development, testing, and production access where possible.",
        "Apply sensitivity labels and governance controls to sensitive analytics assets.",
        "Review privileged access regularly and remove unused permissions."
      ],
      bad: [
        "Make every analyst a workspace administrator for convenience.",
        "Share sensitive data by exporting it to unmanaged spreadsheets.",
        "Store secrets in notebook text cells or comments.",
        "Ignore lineage because the report already displays the correct numbers.",
        "Grant broad access first and plan to clean it up later.",
        "Use one shared account for all users to avoid permission requests."
      ]
    }
  ];

  const questionTypes = [
    "Single Choice",
    "Multiple Choice",
    "Case Study",
    "Scenario Analysis",
    "Drag and Drop",
    "Match Items",
    "Sequence Ordering",
    "Architecture Selection",
    "Data Pipeline Design",
    "Troubleshooting Scenario"
  ];

  const difficulties = ["Foundation", "Intermediate", "Advanced", "Expert"];

  const caseStudies = [
    {
      industry: "Retail company",
      name: "Northwind Retail Group",
      business: "The company receives daily point-of-sale files from stores and hourly online order extracts. Leadership needs same-day sales and inventory reporting.",
      constraints: "The ERP source has no CDC table, but records contain LastModifiedDateTime. Some stores resend corrected files after business close.",
      architecture: "Bronze stores raw files, Silver standardizes sales and inventory lines, and Gold serves curated warehouse tables for reporting."
    },
    {
      industry: "Banking organization",
      name: "BlueRiver Bank",
      business: "The bank analyzes customer transactions, branch performance, and suspicious activity indicators.",
      constraints: "PII must be protected, analysts need masked data by default, and compliance teams require audit visibility.",
      architecture: "Data lands in a secured lakehouse, transformations run in notebooks, and curated metrics are exposed through warehouse tables."
    },
    {
      industry: "Healthcare provider",
      name: "CarePlus Health",
      business: "The provider wants appointment, claims, and patient service analytics with strict privacy controls.",
      constraints: "Data access must follow least privilege. Failed loads must produce alerts because downstream reporting is used for daily operations.",
      architecture: "Pipelines ingest files and API extracts, Dataflows Gen2 standardizes common dimensions, and notebooks prepare large claim tables."
    },
    {
      industry: "Manufacturing company",
      name: "ForgeLine Manufacturing",
      business: "The company measures supplier OTIF, production schedule adherence, and machine downtime.",
      constraints: "Machine telemetry arrives as many small files. ERP purchase receipt updates can arrive late.",
      architecture: "A lakehouse stores telemetry and ERP data, Silver applies business rules, and Gold tables feed operational dashboards."
    },
    {
      industry: "E-commerce platform",
      name: "ShopSphere Online",
      business: "The platform tracks orders, returns, payment events, promotions, and customer retention.",
      constraints: "Order events can arrive out of sequence. Marketing users need aggregate access without seeing sensitive payment attributes.",
      architecture: "Event data is appended to Delta tables, transformations resolve latest order state, and reporting uses curated fact tables."
    },
    {
      industry: "Energy utility",
      name: "GridWorks Energy",
      business: "The utility analyzes outage events, meter readings, maintenance jobs, and regional service KPIs.",
      constraints: "Operations users need near-real-time status, while planners need governed historical trends.",
      architecture: "Raw operational extracts land in Bronze, Silver aligns equipment and region dimensions, and Gold supports reliability dashboards."
    }
  ];

  const choiceStemVariants = [
    "A team is designing a {concept} solution for {scenario}. Which design choice is most appropriate?",
    "You are reviewing a production design for {scenario} that uses {concept}. Which recommendation should you make?",
    "A solution must support repeatable analytics for {scenario}. Which approach best aligns with DP-700-style engineering practices?",
    "During design review, the architect asks how to make {concept} production-ready for {scenario}. What should you choose?",
    "A pilot for {scenario} is moving to production. Which change would improve reliability and governance?"
  ];

  const multiStemVariants = [
    "You are implementing {concept} for {scenario}. Which two actions best improve production reliability?",
    "A deployment checklist is being created for {scenario}. Which two controls should be included?",
    "Which two choices best support a maintainable analytics solution for {scenario}?",
    "The team wants to reduce support incidents in {concept}. Which two actions are most useful?",
    "For {scenario}, which two practices help make the solution auditable and repeatable?"
  ];

  const scenarioStemVariants = [
    "A production analytics run for {scenario} produces inconsistent totals compared with the previous day. The pipeline uses {concept}. What should you check first?",
    "Users report that numbers changed unexpectedly after the latest {concept} run for {scenario}. What is the best first investigation step?",
    "A support ticket says the {scenario} dashboard does not match source totals. Which action should you take first?",
    "After a release, the {concept} process for {scenario} completes but results look incorrect. What is the most appropriate response?",
    "The business questions the trustworthiness of the latest {scenario} data. What should the engineering team inspect first?"
  ];

  const architectureStemVariants = [
    "Which architecture is most suitable for {scenario} when the requirement is governed analytics, repeatable transformations, and scalable reporting?",
    "A team needs a serving pattern for {scenario}. Which architecture gives the best balance of traceability and reporting performance?",
    "Which design best separates raw ingestion, business transformation, and analytics consumption for {scenario}?",
    "You must recommend a target-state analytics architecture for {scenario}. Which option should be selected?"
  ];

  const pipelineStemVariants = [
    "You need to design an incremental pipeline for {scenario}. The source provides a reliable modified timestamp. What is the best pattern?",
    "A source system for {scenario} supports LastModifiedDateTime but not CDC. Which pipeline pattern should be used?",
    "For {scenario}, only new and changed records should be processed after the first load. Which design is best?",
    "The business wants faster refreshes for {scenario} without losing auditability. What incremental design should be recommended?"
  ];

  const troubleshootingStemVariants = [
    "Users report that {scenario} dashboards became slow after a large data refresh. The implementation uses {concept}. Which action is most likely to help?",
    "A refresh for {scenario} now exceeds the expected SLA. What should you investigate before changing capacity settings?",
    "The {concept} workload for {scenario} is slower than last week. Which troubleshooting action is most appropriate?",
    "A performance regression appears after a data volume increase in {scenario}. What should the team do first?"
  ];

  function pick(array, index, offset = 0) {
    return array[(index + offset) % array.length];
  }

  function fill(template, ctx) {
    return template.replaceAll("{concept}", ctx.concept).replaceAll("{scenario}", ctx.scenario);
  }

  function choiceOptions(ctx, index) {
    const correct = pick(ctx.topicObj.good, index);
    const wrongA = pick(ctx.topicObj.bad, index, 1);
    const wrongB = pick(ctx.topicObj.bad, index, 3);
    const wrongC = pick(ctx.topicObj.bad, index, 5);
    return { options: [correct, wrongA, wrongB, wrongC], answer: [0] };
  }

  function multiOptions(ctx, index) {
    const first = pick(ctx.topicObj.good, index, 1);
    const second = pick(ctx.topicObj.good, index, 4);
    const wrongA = pick(ctx.topicObj.bad, index, 2);
    const wrongB = pick(ctx.topicObj.bad, index, 4);
    const wrongC = pick(ctx.topicObj.bad, index, 0);
    return { options: [first, second, wrongA, wrongB, wrongC], answer: [0, 1] };
  }

  function caseOptions(ctx, caseStudy, index) {
    const governed = `Use the existing layered design: land raw data, apply governed transformation rules, publish curated tables, and restrict sensitive access based on role.`;
    const speedOnly = `Let each report author connect directly to source systems so dashboards can be delivered faster.`;
    const noQuality = `Skip data quality checks because the curated layer is only used by internal users.`;
    const broadAccess = `Use a single shared account with full access for all pipelines, notebooks, and reports.`;
    const truncate = `Overwrite the entire analytical store on every run without retaining load history or lineage.`;
    const options = index % 2 === 0
      ? [governed, speedOnly, noQuality, broadAccess]
      : [governed, truncate, speedOnly, broadAccess];
    return {
      question: `Read the case study for ${caseStudy.name}. Which implementation approach best satisfies the business requirements and technical constraints?`,
      options,
      answer: [0],
      caseStudy
    };
  }

  const matchSets = [
    {
      label: "medallion layers",
      left: ["Bronze layer", "Silver layer", "Gold layer", "Monitoring log"],
      right: ["Raw retained data", "Cleansed and conformed data", "Business-ready curated data", "Operational status and diagnostics"],
      answer: {
        "Bronze layer": "Raw retained data",
        "Silver layer": "Cleansed and conformed data",
        "Gold layer": "Business-ready curated data",
        "Monitoring log": "Operational status and diagnostics"
      }
    },
    {
      label: "Fabric workload choices",
      left: ["Pipeline", "Dataflows Gen2", "Notebook", "Warehouse"],
      right: ["Orchestrate movement and activities", "Low-code transformation and shaping", "Spark-based code transformation", "SQL analytics serving layer"],
      answer: {
        "Pipeline": "Orchestrate movement and activities",
        "Dataflows Gen2": "Low-code transformation and shaping",
        "Notebook": "Spark-based code transformation",
        "Warehouse": "SQL analytics serving layer"
      }
    },
    {
      label: "security controls",
      left: ["Workspace role", "Row-level security", "Column masking", "Audit log"],
      right: ["Controls workspace-level capabilities", "Filters rows by user context", "Hides sensitive column values", "Tracks access and activity evidence"],
      answer: {
        "Workspace role": "Controls workspace-level capabilities",
        "Row-level security": "Filters rows by user context",
        "Column masking": "Hides sensitive column values",
        "Audit log": "Tracks access and activity evidence"
      }
    },
    {
      label: "optimization signals",
      left: ["Small files", "Data skew", "Missing rows", "Failed activity"],
      right: ["Consider compaction or file layout tuning", "Inspect shuffle distribution and partitioning", "Check watermark and source extract window", "Review activity output and dependency status"],
      answer: {
        "Small files": "Consider compaction or file layout tuning",
        "Data skew": "Inspect shuffle distribution and partitioning",
        "Missing rows": "Check watermark and source extract window",
        "Failed activity": "Review activity output and dependency status"
      }
    }
  ];

  const sequenceSets = {
    "Implement Data Ingestion": [
      "Confirm source system, authentication, and extraction window",
      "Land raw records with ingestion metadata",
      "Validate row counts and schema expectations",
      "Update watermark after successful validation",
      "Record run metrics and notify on failure"
    ],
    "Transform Data": [
      "Profile raw data and identify business rules",
      "Standardize data types and required columns",
      "Apply deduplication and conformance rules",
      "Write validated Silver output with quality metrics",
      "Publish curated data only after checks pass"
    ],
    "Implement and Manage Analytics Solutions": [
      "Define business process and fact grain",
      "Create conformed dimensions and keys",
      "Build curated fact and aggregate tables",
      "Validate measures against source totals",
      "Expose governed model for reporting users"
    ],
    "Monitor and Optimize": [
      "Review failing activity and error details",
      "Compare run timing, counts, and dependencies",
      "Inspect query plan, Spark UI, or capacity metrics",
      "Apply controlled tuning or retry action",
      "Document root cause and prevention step"
    ],
    "Security and Governance": [
      "Classify sensitive data and user personas",
      "Select least-privilege workspace and item access",
      "Apply row, column, or masking controls as needed",
      "Validate access with representative users",
      "Review audit evidence and remove unnecessary access"
    ]
  };

  function buildQuestion(index) {
    // Break the old index coupling so a question type is not always tied to the same topic.
    const type = questionTypes[index % questionTypes.length];
    const topicObj = topics[(Math.floor(index / questionTypes.length) + index * 2) % topics.length];
    const difficulty = difficulties[(Math.floor(index / 7) + index) % difficulties.length];
    const concept = pick(topicObj.concepts, Math.floor(index / 5) + index);
    const scenario = pick(topicObj.scenarios, Math.floor(index / 11) + index * 3);
    const caseStudy = caseStudies[(Math.floor(index / 13) + index) % caseStudies.length];
    const ctx = { topicObj, type, difficulty, concept, scenario };
    const variantIndex = Math.floor(index / questionTypes.length) + index;

    let built;
    if (type === "Single Choice") {
      built = {
        question: fill(pick(choiceStemVariants, variantIndex), ctx),
        ...choiceOptions(ctx, variantIndex)
      };
    } else if (type === "Multiple Choice") {
      built = {
        question: fill(pick(multiStemVariants, variantIndex), ctx),
        ...multiOptions(ctx, variantIndex)
      };
    } else if (type === "Case Study") {
      built = caseOptions(ctx, caseStudy, variantIndex);
    } else if (type === "Scenario Analysis") {
      const firstCheck = `Review run logs, source extract windows, watermark values, rejected rows, and duplicate-handling rules before changing downstream logic.`;
      built = {
        question: fill(pick(scenarioStemVariants, variantIndex), ctx),
        options: [
          firstCheck,
          pick(ctx.topicObj.bad, variantIndex, 1),
          pick(ctx.topicObj.bad, variantIndex, 3),
          `Immediately rebuild the dashboard visuals without validating the data processing path.`
        ],
        answer: [0]
      };
    } else if (type === "Drag and Drop") {
      const steps = sequenceSets[topicObj.topic];
      built = {
        question: `Arrange the implementation tasks for a production ${concept} solution used for ${scenario}.`,
        options: steps,
        answer: steps.map((_, stepIndex) => stepIndex)
      };
    } else if (type === "Match Items") {
      const set = matchSets[variantIndex % matchSets.length];
      built = {
        question: `Match each ${set.label} item to its best purpose for ${scenario}.`,
        options: [...set.left],
        matchOptions: [...set.right],
        answer: { ...set.answer }
      };
    } else if (type === "Sequence Ordering") {
      const steps = sequenceSets[topicObj.topic];
      built = {
        question: `Place the steps in the correct sequence for handling ${concept} in ${scenario}.`,
        options: steps,
        answer: steps.map((_, stepIndex) => stepIndex)
      };
    } else if (type === "Architecture Selection") {
      built = {
        question: fill(pick(architectureStemVariants, variantIndex), ctx),
        options: [
          `Source systems to Bronze, repeatable Silver rules, curated Gold tables, governed semantic/reporting layer, and monitoring across runs.`,
          `Source systems directly to every report with separate transformations created by each report author.`,
          `Manual CSV export to a local workbook followed by email distribution to business users.`,
          `One overwritten table that combines raw records, transformation logic, and final metrics without audit columns.`
        ],
        answer: [0]
      };
    } else if (type === "Data Pipeline Design") {
      built = {
        question: fill(pick(pipelineStemVariants, variantIndex), ctx),
        options: [
          `Read records greater than the stored watermark, validate counts and quality, handle late-arriving records, and update the watermark only after success.`,
          `Update the watermark before extraction starts so the next run is faster.`,
          `Always truncate curated tables and reload all history without logging row counts.`,
          `Load only the newest file in the folder because older files are usually duplicates.`
        ],
        answer: [0]
      };
    } else {
      built = {
        question: fill(pick(troubleshootingStemVariants, variantIndex), ctx),
        options: [
          `Analyze run history, query patterns, file layout, partitioning strategy, and capacity metrics before applying a targeted fix.`,
          `Disable monitoring because logs may add noise during troubleshooting.`,
          `Ask users to export screenshots until the next scheduled refresh completes.`,
          `Grant everyone administrator access so they can investigate directly in production.`
        ],
        answer: [0]
      };
    }

    const titleNouns = {
      "Implement Data Ingestion": "ingestion strategy",
      "Transform Data": "transformation design",
      "Implement and Manage Analytics Solutions": "analytics model",
      "Monitor and Optimize": "monitoring and tuning",
      "Security and Governance": "security governance"
    };

    return {
      id: `DP700-${String(index + 1).padStart(4, "0")}`,
      title: `${topicObj.topic}: ${titleNouns[topicObj.topic]}`,
      question: built.question,
      options: built.options,
      matchOptions: built.matchOptions || null,
      answer: built.answer,
      explanation: `The correct choice follows a production analytics pattern: it is repeatable, auditable, secure, observable, and aligned with ${topicObj.skill.toLowerCase()}. For ${scenario}, avoid manual shortcuts, broad permissions, missing validation, and designs that remove lineage or recovery options.`,
      topic: topicObj.topic,
      skill_area: topicObj.skill,
      difficulty,
      estimated_time: type === "Case Study" ? 4 : difficulty === "Expert" ? 3 : 2,
      type,
      references: [
        "Public DP-700 skills measured guidance",
        "Microsoft Fabric documentation concepts",
        "General data engineering best practices"
      ],
      caseStudy: built.caseStudy || null,
      uniquenessKey: `${type}|${topicObj.topic}|${concept}|${scenario}|${variantIndex % 17}`
    };
  }

  function generateQuestionBank(total = 1000) {
    const questions = [];
    const seen = new Set();
    let index = 0;
    while (questions.length < total && index < total * 4) {
      const question = buildQuestion(index);
      const key = question.uniquenessKey || `${question.type}|${question.topic}|${question.question}`;
      if (!seen.has(key)) {
        seen.add(key);
        questions.push({ ...question, id: `DP700-${String(questions.length + 1).padStart(4, "0")}` });
      }
      index += 1;
    }
    return questions;
  }

  window.generateQuestionBank = generateQuestionBank;
  window.CASE_STUDIES = caseStudies;
})();
