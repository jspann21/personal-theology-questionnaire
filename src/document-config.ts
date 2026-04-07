export type SectionGroupBlueprint = {
  heading?: string;
  lead: string;
  questionIds: string[];
  maxReferences?: number;
};

export type SectionBlueprint = {
  title: string;
  intro?: string;
  groups: SectionGroupBlueprint[];
};

export const SECTION_BLUEPRINTS: SectionBlueprint[] = [
  {
    title: "Scripture And Revelation",
    intro: "I want this opening section to state what I believe about Scripture, revelation, and the way doctrine should be formed.",
    groups: [
      {
        lead: "I believe Scripture is God's written revelation and the final court of appeal for doctrine and practice.",
        questionIds: ["Q1", "Q2", "Q3"],
      },
      {
        lead: "I believe the church should read Scripture with confidence, care, and a coherent hermeneutic.",
        questionIds: ["Q4", "Q5", "Q6"],
      },
      {
        lead: "I believe God truly reveals himself in creation, yet saving knowledge still depends on the gospel.",
        questionIds: ["Q7"],
      },
    ],
  },
  {
    title: "Theology Proper",
    intro: "In theology proper I summarize what I believe about God's knowledge, character, and ultimate purpose.",
    groups: [
      {
        lead: "I believe God's life and action are perfect and fully consistent with his nature.",
        questionIds: ["Q8", "Q9"],
      },
      {
        lead: "I believe God's love and glory are not rival ends but mutually illuminating realities within his own being and works.",
        questionIds: ["Q10", "Q11"],
      },
    ],
  },
  {
    title: "Trinity",
    intro: "Here I state my trinitarian convictions about the one God who is Father, Son, and Holy Spirit.",
    groups: [
      {
        lead: "I believe the Father, Son, and Holy Spirit are one God in three persons, and I want to describe their relations with care.",
        questionIds: ["Q12", "Q13", "Q15"],
      },
      {
        lead: "I believe the whole canon bears witness to God's triune life, though not every text does so with the same explicitness.",
        questionIds: ["Q14"],
      },
    ],
  },
  {
    title: "Decree And Providence",
    intro: "This section summarizes how I relate God's decree, providence, human action, and the reality of evil.",
    groups: [
      {
        lead: "I believe God rules history wisely and intentionally rather than reacting to events as though they surprised him.",
        questionIds: ["Q16", "Q17", "Q18"],
      },
      {
        lead: "I believe providence must account both for human responsibility and for God's holy relation to evil without making him the author of sin.",
        questionIds: ["Q19", "Q20"],
      },
    ],
  },
  {
    title: "Creation",
    intro: "In creation I want to summarize how I read Genesis, how I understand Adam, and what I affirm about the image of God.",
    groups: [
      {
        lead: "I read Genesis as a truthful account of God's creative work and of humanity's earliest state before sin.",
        questionIds: ["Q21", "Q22", "Q23", "Q24"],
      },
      {
        lead: "I believe humanity bears God's image in a way that shapes both dignity and calling.",
        questionIds: ["Q25", "Q26"],
      },
    ],
  },
  {
    title: "Angelology And Demonology",
    intro: "This section states how I understand demonic opposition and the ordinary practice of spiritual warfare.",
    groups: [
      {
        lead: "I believe spiritual opposition is real, but I want to describe it in biblically disciplined terms.",
        questionIds: ["Q27", "Q28", "Q29"],
      },
    ],
  },
  {
    title: "Anthropology",
    intro: "In anthropology I summarize what I believe about the human person, the image of God, and embodied life.",
    groups: [
      {
        lead: "I believe human beings are created by God as embodied persons and should be described accordingly.",
        questionIds: ["Q30", "Q31"],
      },
      {
        lead: "I believe created sex, vocation, and conscience must be handled in a way that honors both creational order and Christian discipleship.",
        questionIds: ["Q32", "Q33"],
      },
    ],
  },
  {
    title: "Hamartiology",
    intro: "This section explains how I understand original sin, Adamic guilt, and the moral character of human sinfulness.",
    groups: [
      {
        lead: "I believe sin is not a superficial defect but a deep corruption affecting humanity in Adam.",
        questionIds: ["Q34", "Q35"],
      },
      {
        lead: "I believe sin should be defined and evaluated according to God's holiness rather than merely human consequence.",
        questionIds: ["Q36", "Q37"],
      },
    ],
  },
  {
    title: "Christology",
    intro: "In Christology I summarize who Christ is, what he accomplished, and how I understand his present reign.",
    groups: [
      {
        lead: "I believe Jesus Christ is fully God and fully man, and I want to speak carefully about his person and temptations.",
        questionIds: ["Q38", "Q39", "Q40"],
      },
      {
        lead: "I believe Christ's work in death, burial, descent, resurrection, and obedience secures redemption in a definite and meaningful way.",
        questionIds: ["Q41", "Q42", "Q43", "Q44"],
      },
      {
        lead: "I believe the risen Christ now reigns and intercedes as the living Lord of his people.",
        questionIds: ["Q45"],
      },
    ],
  },
  {
    title: "Pneumatology",
    intro: "This section states what I believe about the Holy Spirit's work in conversion, gifting, and sanctification.",
    groups: [
      {
        lead: "I believe the Holy Spirit is personally active in the church and in the believer's life.",
        questionIds: ["Q46", "Q47", "Q48", "Q49", "Q50"],
      },
      {
        lead: "I believe the Spirit ordinarily forms Christlike holiness in a recognizable way within the life of the church.",
        questionIds: ["Q51"],
      },
    ],
  },
  {
    title: "Soteriology",
    intro: "This is the longest doctrinal locus in the document, because here I want my view of grace, conversion, justification, assurance, and perseverance to read as one coherent account.",
    groups: [
      {
        heading: "Human Inability And Prevenient Grace",
        lead: "I believe fallen humanity's condition after the fall must be stated plainly before any account of saving grace can be coherent.",
        questionIds: ["Q52", "Q53"],
      },
      {
        heading: "Election And Foreknowledge",
        lead: "I believe election and foreknowledge should be described in a way that honestly reflects how I think God saves.",
        questionIds: ["Q54", "Q55", "Q56"],
      },
      {
        heading: "Extent And Intent Of The Atonement",
        lead: "I believe Christ's atonement has a definite design, and I want to state both its extent and its efficacy with care.",
        questionIds: ["Q57", "Q58"],
      },
      {
        heading: "Calling, Regeneration, Faith, And Repentance",
        lead: "I believe the gospel call, regeneration, faith, and repentance belong together in the application of redemption.",
        questionIds: ["Q59", "Q60", "Q61", "Q62", "Q63"],
      },
      {
        heading: "Justification And Righteousness",
        lead: "I believe justification must be explained in a way that preserves both the freeness of grace and the nature of righteousness in Christ.",
        questionIds: ["Q64", "Q65"],
      },
      {
        heading: "Union, Adoption, And Assurance",
        lead: "I believe salvation is not exhausted by pardon alone, but includes union, adoption, and a real basis for assurance.",
        questionIds: ["Q66", "Q67", "Q68", "Q76"],
      },
      {
        heading: "Sanctification And Perseverance",
        lead: "I believe sanctification and perseverance should show how grace transforms and keeps the believer over time.",
        questionIds: ["Q69", "Q70", "Q71", "Q72", "Q73"],
      },
      {
        heading: "The Order Of Salvation",
        lead: "I believe the benefits of salvation can be summarized either in a stronger order or a more integrated pattern, and my answer here reflects that judgment.",
        questionIds: ["Q74", "Q75", "Q77"],
      },
      {
        heading: "Divine Sovereignty And Human Responsibility",
        lead: "I believe divine sovereignty and human responsibility must be held together rather than treated as competing absolutes.",
        questionIds: ["Q78"],
      },
      {
        heading: "The Necessity Of Conscious Faith In Christ",
        lead: "I believe the necessity of conscious faith in Christ after the coming of the gospel has to be stated directly and pastorally.",
        questionIds: ["Q79"],
      },
    ],
  },
  {
    title: "Union With Christ",
    intro: "This section states how I understand the believer's union and communion with Christ.",
    groups: [
      {
        lead: "I believe union with Christ is central to the Christian life and should shape the way salvation is described.",
        questionIds: ["Q80", "Q81", "Q82"],
      },
    ],
  },
  {
    title: "Ecclesiology",
    intro: "In ecclesiology I summarize what I believe a church is, how it should be ordered, and who belongs within it.",
    groups: [
      {
        lead: "I believe the local church is a visible covenant community that should be defined by word, sacrament, and discipline.",
        questionIds: ["Q83", "Q84", "Q85", "Q86", "Q87"],
      },
      {
        lead: "I believe church government, leadership, discipline, and catholicity should be practiced in ways that visibly serve Christ's people.",
        questionIds: ["Q88", "Q89", "Q90"],
      },
    ],
  },
  {
    title: "Ordinances And Sacraments",
    intro: "This section explains what I believe about baptism and the Lord's Supper.",
    groups: [
      {
        lead: "I believe baptism should be administered in a way that reflects both its recipients and its theological meaning.",
        questionIds: ["Q91", "Q92", "Q93"],
      },
      {
        lead: "I believe the Lord's Supper is a meaningful act of covenant worship and should be received accordingly.",
        questionIds: ["Q94", "Q95", "Q96"],
      },
    ],
  },
  {
    title: "Spiritual Gifts",
    intro: "In spiritual gifts I summarize how I think prophecy, healing, tongues, and deliverance should function in the church.",
    groups: [
      {
        lead: "I believe spiritual gifts should be discussed with both expectancy and doctrinal restraint.",
        questionIds: ["Q97", "Q98", "Q99", "Q100", "Q101"],
      },
    ],
  },
  {
    title: "Worship And Ministry",
    intro: "This section states what I believe about gathered worship, preaching, pastoral ministry, and the Lord's Day.",
    groups: [
      {
        lead: "I believe corporate worship should be ordered around principles that honor God's word and the church's edification.",
        questionIds: ["Q102", "Q103", "Q104"],
      },
      {
        lead: "I believe ministry roles and material support in the church should reflect biblical conviction rather than convenience alone.",
        questionIds: ["Q105", "Q106"],
      },
    ],
  },
  {
    title: "Christian Ethics",
    intro: "In ethics I summarize how I think obedience, public order, marriage, sexuality, life, and liberty should be understood under Christ's lordship.",
    groups: [
      {
        lead: "I believe Christian ethics must be governed by God's moral will as fulfilled in Christ rather than by private preference.",
        questionIds: ["Q107", "Q108", "Q109", "Q110"],
      },
      {
        lead: "I believe questions of marriage, life, sexuality, and stewardship should be addressed with theological clarity and pastoral honesty.",
        questionIds: ["Q111", "Q112", "Q113", "Q114", "Q115"],
      },
    ],
  },
  {
    title: "Mission And Evangelism",
    intro: "This section states what I believe the church should prioritize in mission and evangelism.",
    groups: [
      {
        lead: "I believe the church's mission should be defined clearly enough to shape methods, priorities, and apologetic practice.",
        questionIds: ["Q116", "Q117", "Q118", "Q119"],
      },
    ],
  },
  {
    title: "Israel, Church, And Covenants",
    intro: "In this section I summarize how I understand covenant continuity, the people of God, and the status of Israel in redemptive history.",
    groups: [
      {
        lead: "I believe the relationship between Israel and the church should be described in a way that does justice to both Testaments.",
        questionIds: ["Q120", "Q121", "Q122"],
      },
      {
        lead: "I believe the new covenant and the older covenant structures must be related with care, especially where membership and law are concerned.",
        questionIds: ["Q123", "Q124", "Q125"],
      },
    ],
  },
  {
    title: "Eschatology",
    intro: "This section summarizes how I understand the millennium, tribulation, Israel's future, final judgment, the intermediate state, and the new creation.",
    groups: [
      {
        lead: "I believe Christ will return bodily and gloriously, and I want to state how I understand the millennium and the tribulation in relation to that return.",
        questionIds: ["Q126", "Q127", "Q128", "Q129", "Q131"],
      },
      {
        lead: "I believe Scripture speaks meaningfully about Israel's future and about the final destiny of the wicked and the righteous.",
        questionIds: ["Q130", "Q132", "Q133", "Q134", "Q135"],
      },
    ],
  },
];


export type StatementTemplate = {
  yes: string;
  no: string;
};

type GeneratedClaim = {
  summary: string;
  paragraphStatement: string;
  outlineStatement: string;
  references: string[];
};

export const QUESTION_STATEMENTS: Record<string, StatementTemplate> = {
  Q1: {
    yes: "I affirm Sola Scriptura and hold that Scripture alone is the final infallible norm for doctrine and practice",
    no: "I affirm a prima Scriptura position in which Scripture remains supreme while apostolic-traditional authority also carries binding weight",
  },
  Q2: {
    yes: "I affirm full inerrancy and hold that Scripture, in its original writings, is wholly true in all that it affirms",
    no: "I affirm a limited inerrancy view in which Scripture is infallible in its saving purpose without requiring comprehensive inerrancy in every affirmation",
  },
  Q3: {
    yes: "I affirm a closed canon and hold that foundational, canonical revelation ceased with the apostolic witness",
    no: "I affirm that non-canonical revelatory gifts continue beyond the apostolic age",
  },
  Q4: {
    yes: "I affirm the perspicuity of Scripture in its central saving message and hold that ordinary believers can understand its essentials",
    no: "I hold that Scripture contains substantial obscurities that ordinarily require stronger interpretive dependence on church teachers",
  },
  Q5: {
    yes: "I affirm the priority of grammatical-historical exegesis in the ordinary construction of doctrine",
    no: "I allow a stronger typological or allegorical priority in certain doctrinal loci",
  },
  Q6: {
    yes: "I affirm that explicit New Testament interpretation should norm disputed Old Testament theological trajectories",
    no: "I affirm that Old Testament promises retain their plain force unless the New Testament explicitly revises them",
  },
  Q7: {
    yes: "I affirm that general revelation renders humanity accountable but cannot save apart from the gospel",
    no: "I affirm a broader revelational inclusivism in which general revelation may play a larger role in relation to salvation",
  },
  Q8: {
    yes: "I affirm that God possesses exhaustive foreknowledge of future free human acts",
    no: "I deny exhaustive definite foreknowledge of future free human acts",
  },
  Q9: {
    yes: "I affirm that God is immutable in his being and covenant faithfulness while Scripture also describes him relationally",
    no: "I affirm a relational mutability emphasis and hold that Scripture's relational descriptions of God reflect real relational change",
  },
  Q10: {
    yes: "I affirm that God loves all people salvifically in a real sense and not only the elect",
    no: "I deny a universal salvific love and hold that God's saving love is directed particularly toward the elect",
  },
  Q11: {
    yes: "I affirm that God's glory is the highest end of all his works",
    no: "I deny that God's glory should be treated as the highest end of all his works and instead summarize his purposes more centrally in terms of love or relational communion",
  },
  Q12: {
    yes: "I affirm that the eternal relation between the Father and the Son may be described in terms of eternal authority and submission",
    no: "I deny that the eternal relation between the Father and the Son should be described in terms of eternal authority and submission",
  },
  Q13: {
    yes: "I affirm eternal generation as the proper description of the Son's relation to the Father",
    no: "I deny eternal generation and hold that the Son's relation to the Father should not be defined that way",
  },
  Q14: {
    yes: "I affirm that the Old Testament contains genuine though veiled indications of plurality within the Godhead",
    no: "I deny that the Old Testament itself contains genuine indications of plurality within the Godhead beyond later Christian hindsight",
  },
  Q15: {
    yes: "I affirm the filioque and hold that the Spirit proceeds from the Father and the Son",
    no: "I deny the filioque and hold that the Spirit proceeds from the Father in a way not properly described as proceeding from the Son",
  },
  Q16: {
    yes: "I affirm that God ordains whatsoever comes to pass",
    no: "I deny that God ordains whatsoever comes to pass in an exhaustive decretal sense",
  },
  Q17: {
    yes: "I affirm that libertarian freedom is necessary for moral responsibility",
    no: "I deny that libertarian freedom is necessary for moral responsibility",
  },
  Q18: {
    yes: "I affirm that God wills in more than one sense, including decretive and preceptive willing",
    no: "I deny that God's will should be divided into multiple senses such as decretive and preceptive willing",
  },
  Q19: {
    yes: "I affirm meticulous providence as the best description of God's governance over ordinary events",
    no: "I deny that meticulous providence is the best description of God's governance over ordinary events",
  },
  Q20: {
    yes: "I affirm that God ordains even evil events for wise and good ends while he himself remains unstained by evil",
    no: "I deny that God's providence should be described as ordaining evil events, even while I still affirm his sovereign rule over them",
  },
  Q21: {
    yes: "I affirm that Gen 1 teaches six ordinary days of creation",
    no: "I deny that Gen 1 requires six ordinary days of creation",
  },
  Q22: {
    yes: "I affirm that the days of Gen 1 should be read as a sequential chronological account",
    no: "I deny that the days of Gen 1 require a strictly sequential chronological reading",
  },
  Q23: {
    yes: "I affirm that Adam was a historical individual and not merely an archetypal symbol",
    no: "I deny that Adam must be understood as a historical individual rather than as an archetypal or representative figure",
  },
  Q24: {
    yes: "I affirm the special creation of Adam and Eve rather than common ancestry with other living creatures",
    no: "I allow human origins to be understood in continuity with common ancestry rather than requiring the special creation of Adam and Eve",
  },
  Q25: {
    yes: "I affirm that death was absent from the created order before human sin",
    no: "I deny that death in the created order was entirely absent before human sin",
  },
  Q26: {
    yes: "I affirm that the image of God is located chiefly in humanity's representative function",
    no: "I deny that the image of God is located chiefly in humanity's representative function and give greater weight to substantive or relational qualities",
  },
  Q27: {
    yes: "I affirm that a true believer may be subject to severe inward demonic influence beyond mere external oppression",
    no: "I deny that a true believer may be subject to severe inward demonic influence beyond external oppression",
  },
  Q28: {
    yes: "I affirm territorial or strategic-level spiritual warfare as a valid category for ministry strategy",
    no: "I deny that territorial or strategic-level spiritual warfare is a valid category for ordinary ministry strategy",
  },
  Q29: {
    yes: "I affirm that Christians may directly address demonic powers in ordinary ministry",
    no: "I deny that directly addressing demonic powers should characterize ordinary Christian ministry",
  },
  Q30: {
    yes: "I affirm a dichotomous understanding of humanity rather than a trichotomous one",
    no: "I affirm a trichotomous understanding of humanity rather than a dichotomous one",
  },
  Q31: {
    yes: "I affirm that the image of God remains in fallen humanity after sin",
    no: "I deny that the image of God remains intact in fallen humanity after sin and locate its fuller restoration chiefly in redemption",
  },
  Q32: {
    yes: "I affirm that men and women are equal in dignity while also bearing distinct covenantal roles in the home and church",
    no: "I deny that men and women are assigned distinct covenantal roles in the home and church",
  },
  Q33: {
    yes: "I affirm that the conscience can function as a reliable moral guide apart from explicit scriptural calibration",
    no: "I deny that the conscience is a reliable moral guide apart from scriptural calibration",
  },
  Q34: {
    yes: "I affirm that Adam's first sin brought guilt to all humanity by imputation",
    no: "I deny that Adam's first sin brought guilt to all humanity by imputation",
  },
  Q35: {
    yes: "I affirm original sin as total inability apart from grace",
    no: "I deny that original sin should be defined as total inability apart from grace",
  },
  Q36: {
    yes: "I affirm that sin should be understood primarily in terms of disordered love and idolatry rather than only rule-breaking",
    no: "I deny that sin is best defined primarily as disordered love and idolatry rather than rule-breaking",
  },
  Q37: {
    yes: "I affirm that all sins are equal in demerit before God",
    no: "I deny that all sins are equal in demerit before God",
  },
  Q38: {
    yes: "I affirm that Jesus Christ is one divine person in two distinct natures, fully God and fully man forever",
    no: "I deny the classic Chalcedonian formulation that Jesus Christ is one divine person in two distinct natures forever",
  },
  Q39: {
    yes: "I affirm that Jesus was conceived by the Holy Spirit and born of the virgin Mary",
    no: "I deny the virgin conception and birth of Jesus by the Holy Spirit",
  },
  Q40: {
    yes: "I affirm the impeccability of Christ and hold that he was unable to sin",
    no: "I deny the impeccability of Christ and hold that his temptability included the possibility of sinning",
  },
  Q41: {
    yes: "I affirm that Christ descended to the dead between his crucifixion and resurrection",
    no: "I deny a distinct descent of Christ to the dead beyond his death, burial, or immediate entrance into paradise",
  },
  Q42: {
    yes: "I affirm that Jesus rose bodily from the dead on the third day",
    no: "I deny that Jesus rose bodily from the dead on the third day",
  },
  Q43: {
    yes: "I affirm penal substitution as the primary explanation of the atonement",
    no: "I deny that penal substitution should be treated as the primary explanation of the atonement",
  },
  Q44: {
    yes: "I affirm that Christ's active obedience contributes positively to believers' justification",
    no: "I deny that Christ's active obedience is imputed in justification and ground justification chiefly in Christ's atoning death",
  },
  Q45: {
    yes: "I affirm Christ's present heavenly session as an active mediatorial reign over the church and the nations now",
    no: "I deny that Christ's present session should be described as an active mediatorial reign over the church and the nations now",
  },
  Q46: {
    yes: "I affirm that Spirit baptism normally coincides with conversion and incorporation into Christ",
    no: "I deny that Spirit baptism normally coincides with conversion and incorporation into Christ",
  },
  Q47: {
    yes: "I affirm speaking in tongues as the initial physical evidence of Spirit baptism",
    no: "I deny that speaking in tongues is the initial physical evidence of Spirit baptism",
  },
  Q48: {
    yes: "I affirm that miraculous sign gifts are intended for the whole church age",
    no: "I affirm that miraculous sign gifts were tied chiefly to the apostolic foundation and are therefore unusual today",
  },
  Q49: {
    yes: "I affirm that congregational prophecy may be fallible and therefore should be weighed",
    no: "I deny that congregational prophecy should be treated as potentially fallible and hold that genuine prophecy speaks with divine authority",
  },
  Q50: {
    yes: "I affirm that the Spirit ordinarily sanctifies through ordinary means rather than crisis experiences",
    no: "I deny that the Spirit ordinarily sanctifies primarily through ordinary means rather than crisis experiences",
  },
  Q51: {
    yes: "I affirm that believers can seriously resist the sanctifying work of the Spirit",
    no: "I deny that believers can seriously resist the sanctifying work of the Spirit in a way that finally overturns his preserving purpose",
  },
  Q52: {
    yes: "I affirm total inability and hold that spiritually dead sinners cannot come to Christ apart from prior efficacious grace",
    no: "I deny total inability in that form and hold that sinners may respond through prevenient or resistible grace",
  },
  Q53: {
    yes: "I affirm universal prevenient grace that sufficiently counteracts total inability so that all hearers may freely respond to the gospel",
    no: "I deny universal prevenient grace and affirm special efficacious grace only",
  },
  Q54: {
    yes: "I affirm unconditional election rather than election grounded in foreseen faith",
    no: "I affirm conditional election grounded in foreseen faith",
  },
  Q55: {
    yes: "I affirm that election in Christ is best understood primarily as corporate, with individuals sharing in it through union with Christ by faith",
    no: "I affirm that election is best understood primarily in individual rather than corporate terms",
  },
  Q56: {
    yes: "I affirm that God's foreknowledge in Rom 8:29 is best understood relationally rather than as simple foresight of future faith",
    no: "I affirm that God's foreknowledge in Rom 8:29 includes foresight of future faith",
  },
  Q57: {
    yes: "I affirm that Christ died with the specific intent infallibly to save the elect",
    no: "I deny that Christ died with the specific intent infallibly to save the elect",
  },
  Q58: {
    yes: "I affirm that Christ's atoning death itself secured the saving faith and final salvation of those for whom he died",
    no: "I deny that Christ's atoning death itself secured the saving faith and final salvation of those for whom he died and instead treat its saving application as conditional",
  },
  Q59: {
    yes: "I affirm the sincere free offer of the gospel to all hearers",
    no: "I deny that the outward gospel call reflects the same well-meant divine intention toward every hearer",
  },
  Q60: {
    yes: "I affirm irresistible grace in the effectual call",
    no: "I affirm that saving grace in the effectual call can finally be resisted",
  },
  Q61: {
    yes: "I affirm that regeneration logically precedes and produces saving faith",
    no: "I deny that regeneration logically precedes saving faith",
  },
  Q62: {
    yes: "I affirm that faith itself is a special gift granted only to the elect",
    no: "I deny that faith itself is a special gift granted only to the elect and treat it as a commanded human response enabled by grace",
  },
  Q63: {
    yes: "I affirm that repentance is divinely granted",
    no: "I deny that repentance should be described primarily as divinely granted rather than as a commanded human response",
  },
  Q64: {
    yes: "I affirm justification by faith alone as the exclusive instrument of receiving Christ's righteousness",
    no: "I deny that justification by faith alone is the exclusive instrument in the full and final sense",
  },
  Q65: {
    yes: "I affirm the imputation of Christ's righteousness to believers",
    no: "I deny that justification is best explained by the imputation of Christ's righteousness",
  },
  Q66: {
    yes: "I affirm that union with Christ is the broader reality from which justification, adoption, and sanctification flow",
    no: "I deny that union with Christ should function as the primary organizing center for these benefits",
  },
  Q67: {
    yes: "I affirm that assurance of salvation is ordinarily attainable in the Christian life even if it is not always constant",
    no: "I deny that assurance of salvation is ordinarily attainable as a settled condition in the Christian life",
  },
  Q68: {
    yes: "I affirm that assurance should ordinarily be grounded chiefly in Christ's promise and the Spirit's present witness",
    no: "I affirm that assurance should ordinarily be grounded more heavily in evidences of perseverance and self-examination",
  },
  Q69: {
    yes: "I affirm that all true believers will certainly persevere to final salvation",
    no: "I deny that all true believers will certainly persevere to final salvation",
  },
  Q70: {
    yes: "I affirm that a truly justified person may later become unjustified through unbelief or apostasy",
    no: "I deny that a truly justified person may later become unjustified through unbelief or apostasy",
  },
  Q71: {
    yes: "I affirm that the major warning passages describe genuinely regenerate believers who can finally fall away",
    no: "I deny that the major warning passages describe genuinely regenerate believers who finally fall away",
  },
  Q72: {
    yes: "I affirm that sanctification is decisively initiated at conversion",
    no: "I deny that sanctification is decisively initiated at conversion alone and allow a later second-blessing emphasis",
  },
  Q73: {
    yes: "I affirm that entire sanctification or freedom from willful sin is possible in this life",
    no: "I deny that entire sanctification or freedom from willful sin is possible in this life",
  },
  Q74: {
    yes: "I affirm baptism as the normative public response closely tied to conversion",
    no: "I deny that baptism is so closely tied to conversion that it becomes constitutive of conversion itself",
  },
  Q75: {
    yes: "I affirm that justification and final judgment according to works should be harmonized by treating works as evidential fruit rather than co-instrumental cause",
    no: "I deny that works are merely evidential in final judgment and affirm a more integral role for obedient perseverance",
  },
  Q76: {
    yes: "I affirm adoption as a distinct salvific benefit",
    no: "I deny that adoption should be treated as a distinct salvific benefit",
  },
  Q77: {
    yes: "I affirm a fixed order of salvation as the best summary of the application of redemption",
    no: "I deny that a fixed order of salvation is the best overall summary of the application of redemption",
  },
  Q78: {
    yes: "I affirm that divine sovereignty in salvation operates compatibilistically with meaningful human responsibility",
    no: "I deny compatibilism and affirm a more libertarian account of human responsibility in salvation",
  },
  Q79: {
    yes: "I affirm that conscious personal faith in Christ is ordinarily necessary for salvation after the coming of the gospel",
    no: "I deny that conscious personal faith in Christ is ordinarily necessary for salvation in every case after the coming of the gospel",
  },
  Q80: {
    yes: "I affirm that union with Christ is primarily covenantal and representative rather than primarily mystical and participatory",
    no: "I affirm a more participatory and mystical account of union with Christ rather than making covenantal representation primary",
  },
  Q81: {
    yes: "I affirm that sacramental participation ordinarily serves as a means of deepening believers' communion with Christ",
    no: "I deny that sacramental participation ordinarily mediates communion with Christ in a distinctive means-of-grace sense",
  },
  Q82: {
    yes: "I affirm that in-Christ language should control Christian identity more than individualized decision language",
    no: "I deny that in-Christ language should displace individualized decision language as the primary frame of Christian identity",
  },
  Q83: {
    yes: "I affirm that the local church should be constituted only by professing believers",
    no: "I deny that the local church should be constituted only by professing believers",
  },
  Q84: {
    yes: "I affirm congregational polity as preferable to presbyterial or episcopal polity",
    no: "I deny that congregational polity is preferable to presbyterial or episcopal polity",
  },
  Q85: {
    yes: "I affirm that a plurality of elders should ordinarily lead each local congregation",
    no: "I deny that a plurality of elders is the ordinary norm for each local congregation",
  },
  Q86: {
    yes: "I affirm that women may serve as pastors or elders",
    no: "I deny that women may serve as pastors or elders",
  },
  Q87: {
    yes: "I affirm that women may serve as deacons",
    no: "I deny that women may serve as deacons",
  },
  Q88: {
    yes: "I affirm that church discipline should include formal exclusion from the Lord's Table and membership in cases of serious unrepentant sin",
    no: "I deny that church discipline should ordinarily include formal exclusion from the Lord's Table and membership in that way",
  },
  Q89: {
    yes: "I affirm that the visible church is broader than any one denomination and includes all true believers",
    no: "I deny that the visible church should be described broadly in that trans-denominational sense",
  },
  Q90: {
    yes: "I affirm that formal membership covenants are biblically warranted",
    no: "I deny that formal membership covenants are biblically warranted",
  },
  Q91: {
    yes: "I affirm that baptism should be administered only to those who personally profess faith",
    no: "I deny that baptism should be administered only to those who personally profess faith",
  },
  Q92: {
    yes: "I affirm immersion as the normative apostolic mode of baptism",
    no: "I deny that immersion is the only normative apostolic mode of baptism",
  },
  Q93: {
    yes: "I affirm that baptism ordinarily functions as a sign and seal rather than as the moment of regeneration itself",
    no: "I deny that baptism is ordinarily only a sign and seal and affirm a stronger regenerative or sacramental efficacy",
  },
  Q94: {
    yes: "I affirm that the Lord's Supper is primarily memorial and proclamatory rather than a means of real spiritual feeding",
    no: "I deny that the Lord's Supper is primarily memorial and proclamatory and affirm that it is a means of real spiritual feeding",
  },
  Q95: {
    yes: "I affirm that the Lord's Supper should be restricted to baptized believers under church oversight",
    no: "I deny that the Lord's Supper should be restricted in that way",
  },
  Q96: {
    yes: "I affirm foot washing as an abiding church ordinance",
    no: "I deny that foot washing is an abiding church ordinance",
  },
  Q97: {
    yes: "I affirm that private prayer in tongues should be encouraged for personal edification",
    no: "I deny that private prayer in tongues should be encouraged for personal edification",
  },
  Q98: {
    yes: "I affirm that all congregational prophecy should be publicly weighed",
    no: "I deny that all congregational prophecy must be publicly weighed and allow that genuine prophecy may be received as the word of the Lord",
  },
  Q99: {
    yes: "I affirm that divine healing in the atonement should be expected ordinarily in the present age",
    no: "I deny that divine healing in the atonement should be expected ordinarily in the present age",
  },
  Q100: {
    yes: "I affirm deliverance ministry as a normal specialized ministry in the local church",
    no: "I deny that deliverance ministry should be treated as a normal specialized ministry in the local church",
  },
  Q101: {
    yes: "I affirm that miraculous gifts were chiefly tied to the apostolic foundation and are therefore unusual today",
    no: "I deny that miraculous gifts were chiefly tied to the apostolic foundation in a way that makes them unusual today",
  },
  Q102: {
    yes: "I affirm that corporate worship should be governed only by what Scripture positively warrants",
    no: "I deny that corporate worship must be governed only by what Scripture positively warrants",
  },
  Q103: {
    yes: "I affirm expository preaching as the ordinary central act of the Lord's Day assembly",
    no: "I deny that expository preaching must ordinarily be the central act of the Lord's Day assembly",
  },
  Q104: {
    yes: "I affirm the weekly Lord's Day as the Christian Sabbath in some abiding sense",
    no: "I deny that the weekly Lord's Day should be described as the Christian Sabbath in an abiding sense",
  },
  Q105: {
    yes: "I affirm that women may preach to mixed adult congregations under church authorization",
    no: "I deny that women may preach to mixed adult congregations under church authorization",
  },
  Q106: {
    yes: "I affirm that pastoral ministry may ordinarily be bi-vocational rather than requiring full-time salary support",
    no: "I deny that pastoral ministry should ordinarily be treated as bi-vocational rather than requiring full-time support",
  },
  Q107: {
    yes: "I affirm that the Mosaic civil law remains directly binding on modern states unless specifically repealed",
    no: "I deny that the Mosaic civil law remains directly binding on modern states unless specifically repealed and instead read civil ethics through general equity or new-covenant categories",
  },
  Q108: {
    yes: "I affirm capital punishment for murder as a continuing moral norm rooted before Moses",
    no: "I deny capital punishment for murder as a continuing moral norm rooted before Moses",
  },
  Q109: {
    yes: "I affirm that just-war participation is compatible with Christian discipleship",
    no: "I deny that just-war participation is compatible with Christian discipleship",
  },
  Q110: {
    yes: "I affirm that divorce with remarriage is biblically permitted in some cases",
    no: "I deny that divorce with remarriage is biblically permitted in any ordinary case",
  },
  Q111: {
    yes: "I affirm that abortion should be treated as the taking of human life from conception",
    no: "I deny that abortion should be treated as the taking of human life from conception in every case",
  },
  Q112: {
    yes: "I affirm that biblical prohibitions of same-sex intercourse apply universally and not merely to exploitative, idolatrous, or culturally bound contexts",
    no: "I deny that biblical prohibitions of same-sex intercourse apply universally and read them as limited to exploitative, idolatrous, or culturally bound contexts",
  },
  Q113: {
    yes: "I affirm that a Christian's sexed identity should be received as a creational given rather than redefined by inward gender self-perception",
    no: "I deny that a Christian's sexed identity must be received as a fixed creational given and allow inward gender self-perception to redefine it",
  },
  Q114: {
    yes: "I affirm that moderate use of alcohol is morally permissible for Christians",
    no: "I deny that moderate use of alcohol is morally permissible for Christians",
  },
  Q115: {
    yes: "I affirm the tithe as a binding norm of ten percent for Christians",
    no: "I deny that a ten percent tithe remains a binding norm for Christians",
  },
  Q116: {
    yes: "I affirm that the church's mission should be defined primarily as disciple-making rather than broad cultural transformation",
    no: "I deny that the church's mission should be defined primarily as disciple-making rather than broad cultural transformation",
  },
  Q117: {
    yes: "I affirm a public invitation or altar call as a biblically warranted evangelistic practice",
    no: "I deny that a public invitation or altar call is a biblically warranted evangelistic practice",
  },
  Q118: {
    yes: "I affirm that missionary strategy should prioritize unreached peoples over already evangelized contexts",
    no: "I deny that missionary strategy should prioritize unreached peoples over already evangelized contexts in that way",
  },
  Q119: {
    yes: "I affirm apologetics as a necessary ordinary component of evangelism",
    no: "I deny that apologetics is a necessary ordinary component of evangelism",
  },
  Q120: {
    yes: "I affirm that the church is the continuation or fulfillment of God's one covenant people rather than a distinct parenthetical people",
    no: "I affirm a continuing distinction between Israel and the church rather than treating the church as the continuation or fulfillment of Israel",
  },
  Q121: {
    yes: "I affirm that Old Testament land promises retain a future national fulfillment for ethnic Israel",
    no: "I deny that Old Testament land promises retain a future national fulfillment for ethnic Israel",
  },
  Q122: {
    yes: "I affirm that Israel and the church should be kept distinct in prophetic interpretation",
    no: "I deny that Israel and the church should be kept distinct in prophetic interpretation",
  },
  Q123: {
    yes: "I affirm that the new covenant is made only with regenerate members",
    no: "I deny that the new covenant is made only with regenerate members",
  },
  Q124: {
    yes: "I affirm that the Abrahamic covenant should be treated as one promise fulfilled in Christ rather than as separate redemptive tracks",
    no: "I affirm that the Abrahamic covenant includes distinguishable promise lines rather than only one Christocentric fulfillment track",
  },
  Q125: {
    yes: "I affirm that the Mosaic law as covenant is obsolete under the new covenant",
    no: "I deny that the Mosaic law as covenant is obsolete under the new covenant and affirm stronger continuity in its covenant obligations",
  },
  Q126: {
    yes: "I affirm that Christ will return before a future earthly millennium",
    no: "I deny that Christ will return before a future earthly millennium",
  },
  Q127: {
    yes: "I affirm that Rev 20's thousand years should be read literally as a future earthly reign",
    no: "I deny that Rev 20's thousand years should be read literally as a future earthly reign",
  },
  Q128: {
    yes: "I affirm that the millennium should be understood as a period of widespread gospel success and disciple-making among the nations before Christ returns",
    no: "I deny that the millennium should be understood as a pre-consummation era of widespread gospel success in that way",
  },
  Q129: {
    yes: "I affirm that the church will be raptured before a future tribulation",
    no: "I deny that the church will be raptured before a future tribulation",
  },
  Q130: {
    yes: "I affirm a distinct future conversion or restoration of ethnic Israel",
    no: "I deny that Scripture teaches a distinct future conversion or restoration of ethnic Israel",
  },
  Q131: {
    yes: "I affirm that the tribulation is principally future rather than fulfilled primarily in AD 70 and the church age",
    no: "I deny that the tribulation is principally future and read much of it as fulfilled in AD 70 or the broader church age",
  },
  Q132: {
    yes: "I affirm a final conscious eternal punishment of the wicked",
    no: "I deny a final conscious eternal punishment of the wicked",
  },
  Q133: {
    yes: "I affirm that the intermediate state is conscious for believers before the resurrection",
    no: "I deny that the intermediate state is conscious for believers before the resurrection",
  },
  Q134: {
    yes: "I affirm a bodily resurrection of the dead for final judgment and everlasting life or punishment",
    no: "I deny a bodily resurrection of the dead for final judgment and everlasting life or punishment",
  },
  Q135: {
    yes: "I affirm the new creation as cosmic renewal rather than total replacement",
    no: "I deny that the new creation should be understood primarily as cosmic renewal rather than total replacement",
  },
};
