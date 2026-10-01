import type { ArticleGroup } from './articles';
import type { Locale } from '../i18n/routes';
interface PortfolioEntry {
 id: string; kind: 'research' | 'projects'; source?: string; href?: string; area: string; featured: boolean;
 _provenance?: string; // internal source/provenance reference; not rendered publicly
 copy: Record<Locale, { title: string; summary: string; status: string }>;
}
export const portfolio: PortfolioEntry[] = [
  {
    "id": "childcare-risk",
    "href": "https://github.com/seraphforge/Vacant-Education-Bureau",
    "kind": "projects",
    "source": "first-hackathon-in-university",
    "area": "Web · AWS · Data",
    "featured": true,
    "copy": {
      "zh": {
        "title": "教保機構風險監測平台",
        "summary": "黑客松團隊製作的家長匿名回報平台，包含帳號驗證、案件追蹤構想與資料爬蟲開發。",
        "status": "黑客松原型；已公開專案程式庫。"
      },
      "en": {
        "title": "Childcare Risk Monitoring",
        "summary": "A hackathon reporting platform for parents, with account verification, case-tracking design, and data crawling work.",
        "status": "Hackathon prototype with a documented public repository."
      },
      "ja": {
        "title": "保育施設リスク監視プラットフォーム",
        "summary": "保護者向け匿名通報プラットフォーム。アカウント認証、案件追跡の設計、データ収集に取り組んだチーム開発。",
        "status": "ハッカソンの試作。公開リポジトリあり。"
      }
    }
  },
  {
    "id": "frc-robot",
    "kind": "projects",
    "source": "frc-engineering-team",
    "area": "Robotics · FRC",
    "featured": true,
    "copy": {
      "zh": {
        "title": "FRC 機器人整備與團隊協作",
        "summary": "帶領團隊在短期準備中整備、維修機器人並參加季後賽。",
        "status": "已參賽；屬團隊工程紀錄，未宣稱獨立設計整台機器人。"
      },
      "en": {
        "title": "FRC Robot Preparation",
        "summary": "Led a team through robot preparation, repairs, and participation in an off-season competition.",
        "status": "Competition completed; team engineering work, not a claim of sole robot design."
      },
      "ja": {
        "title": "FRC ロボットの整備",
        "summary": "短期間の準備でチームを率い、ロボットの整備・修理を行ってオフシーズン大会に参加。",
        "status": "大会参加済み。チームのエンジニアリング記録であり、機体全体の単独設計を主張するものではありません。"
      }
    }
  },
  {
    "id": "healthcare",
    "kind": "research",
    "source": "nurse-made-me-rethink-medical-cybersecurity",
    "area": "Medical IoT · Security",
    "featured": true,
    "copy": {
      "zh": {
        "title": "醫療 IoT 安全與臨床需求",
        "summary": "生命徵象資料驗證如何配合真實臨床流程？透過與護理師討論重新檢視問題。",
        "status": "需求探索；未宣稱臨床驗證。"
      },
      "en": {
        "title": "Medical IoT Security and Clinical Needs",
        "summary": "How should vital-sign data validation fit real clinical workflows? Discussions with nurses informed a review of the problem.",
        "status": "Needs exploration; no clinical validation claimed."
      },
      "ja": {
        "title": "医療 IoT セキュリティと臨床ニーズ",
        "summary": "バイタルデータの検証を臨床の流れにどう合わせるか。看護師との対話から課題を見直す。",
        "status": "ニーズの探究。臨床検証は主張していません。"
      }
    }
  },
  {
    "id": "edge",
    "kind": "research",
    "source": "recent-projects-and-life-update",
    "area": "Offline AI · Edge Computing",
    "featured": true,
    "copy": {
      "zh": {
        "title": "離線／Edge AI",
        "summary": "斷網或敏感資料無法離開設備時，探索模型大小、記憶體、量化與推論效能的限制。",
        "status": "探索中；未提供效能測試結果。"
      },
      "en": {
        "title": "Offline / Edge AI",
        "summary": "Exploring model size, memory, quantization, and inference constraints when connectivity or sensitive-data movement is limited.",
        "status": "Exploration; no benchmark results published."
      },
      "ja": {
        "title": "オフライン／エッジ AI",
        "summary": "通信や機密データの持ち出しが制限される環境で、モデル規模、メモリ、量子化、推論性能の制約を調べる。",
        "status": "探究段階。性能測定結果は未公開。"
      }
    }
  },
  {
    "id": "agent-boundaries",
    "kind": "research",
    "source": "recent-projects-and-life-update",
    "area": "AI Agents · Security",
    "featured": false,
    "copy": {
      "zh": {
        "title": "AI Agent 權限邊界",
        "summary": "能操作系統的 AI 應取得多少權限？從醫療情境與資料限制出發整理問題。",
        "status": "問題探索；未宣稱完成安全機制。"
      },
      "en": {
        "title": "AI Agent Permission Boundaries",
        "summary": "What permissions should an AI that operates a system receive? Investigating the question through healthcare and data constraints.",
        "status": "Question exploration; no completed security mechanism claimed."
      },
      "ja": {
        "title": "AI エージェントの権限境界",
        "summary": "システムを操作する AI にどこまで権限を与えるか。医療とデータの制約から問いを整理する。",
        "status": "課題の探究。完成した安全機構は主張していません。"
      }
    }
  },
  {
    "id": "uav",
    "kind": "research",
    "source": "2026-security-conference",
    "area": "Drone / UAV · ROS / ROS2",
    "featured": false,
    "copy": {
      "zh": {
        "title": "無人機／機器人安全",
        "summary": "關注 ROS 系統的通訊安全、權限控管與節點驗證，作為後續工程調查方向。",
        "status": "研討會觀察與方向探索；尚無公開實驗成果。"
      },
      "en": {
        "title": "Drone / UAV and Robot Security",
        "summary": "Investigating ROS communication security, permissions, and node authentication as a direction for further engineering work.",
        "status": "Conference-informed exploration; no public experimental results."
      },
      "ja": {
        "title": "ドローン／ロボットのセキュリティ",
        "summary": "今後の技術調査の方向として ROS の通信安全性、権限制御、ノード認証に注目。",
        "status": "カンファレンスでの観察に基づく探究。実験成果は未公開。"
      }
    }
  },
  {
    "id": "malware",
    "kind": "research",
    "source": "ctf-meets-malware-analysis-windows",
    "area": "Windows · Malware Analysis",
    "featured": false,
    "copy": {
      "zh": {
        "title": "Windows 惡意程式分析",
        "summary": "從實作練習追查程式行為與異常連線，理解 CTF 之外的防禦與事件分析。",
        "status": "實作學習紀錄；非新漏洞或攻擊工具發表。"
      },
      "en": {
        "title": "Windows Malware Analysis",
        "summary": "Studying program behavior and suspicious connections through practical exercises, extending beyond CTF into defensive analysis.",
        "status": "Practical learning record; not a new vulnerability or offensive-tool release."
      },
      "ja": {
        "title": "Windows マルウェア解析",
        "summary": "実習でプログラムの挙動と不審な通信を調べ、CTF を越えて防御・インシデント分析を学ぶ。",
        "status": "実習の記録。新しい脆弱性や攻撃ツールの発表ではありません。"
      }
    }
  },
  {
    "id": "medtrust",
    "kind": "projects",
    "_provenance": "nagi.tw/src/data/projects.ts + source/systems/medtrust/index.md",
    "area": "Medical IoT · Security",
    "featured": false,
    "copy": {
      "zh": {
        "title": "MedTrust",
        "summary": "檢查醫療 IoT 訊息與匯出實驗證據一致性的原型，以 Gateway 作為訊息驗證邊界。工具鏈包含 ESP32-S3、FastAPI 與 SQLite，測試情境涵蓋重放攻擊與無效簽章偵測。",
        "status": "研究原型。目前僅主張 integrity consistency，尚未提供 Digital Signature 或 Identity Proof。"
      },
      "en": {
        "title": "MedTrust",
        "summary": "A prototype for checking Medical IoT message integrity and evidence consistency at a gateway boundary. Uses ESP32-S3, FastAPI, and SQLite; test scenarios include replay attacks and invalid-signature detection.",
        "status": "Research prototype. Current claim is integrity consistency only; Digital Signature and Identity Proof are not provided."
      },
      "ja": {
        "title": "MedTrust",
        "summary": "ゲートウェイでの医療 IoT メッセージの整合性と証拠一貫性を検証する試作。ESP32-S3、FastAPI、SQLite を使用し、リプレイ攻撃と無効署名の検出シナリオをテスト済み。",
        "status": "研究試作。現在の主張は整合性一貫性のみ。デジタル署名や身元証明は未提供。"
      }
    }
  },
  {
    "id": "5g",
    "kind": "research",
    "_provenance": "nagi.tw/src/data/research.ts",
    "area": "5G · Communications Security",
    "featured": false,
    "copy": {
      "zh": {
        "title": "5G 通訊安全",
        "summary": "持續探索中的通訊安全方向，尚未整理公開的研究方法、成果或論文。",
        "status": "進行中；尚無公開實驗成果。"
      },
      "en": {
        "title": "5G Communication Security",
        "summary": "An ongoing area of study in communications security. Detailed methods, results, and publications are not yet presented.",
        "status": "Ongoing; no public experimental results."
      },
      "ja": {
        "title": "5G 通信セキュリティ",
        "summary": "継続的に探究中の通信セキュリティ分野。詳細な研究手法、成果、論文はまだ公開していません。",
        "status": "進行中。公開された実験成果はまだありません。"
      }
    }
  },
  {
    "id": "embedded",
    "kind": "research",
    "source": "recent-projects-and-life-update",
    "_provenance": "nagi.tw/src/data/research.ts + recent-projects-and-life-update article",
    "area": "Embedded Systems · Robotics",
    "featured": false,
    "copy": {
      "zh": {
        "title": "嵌入式與自主系統",
        "summary": "透過裝置、Linux 與系統整合實作，探索嵌入式系統與機器人。涵蓋 ESP32、ROS2 通訊驗證與邊緣運算整合等方向。",
        "status": "探索中；未宣稱完整系統設計或安全驗證結果。"
      },
      "en": {
        "title": "Embedded / Autonomous Systems",
        "summary": "Exploring embedded systems and robotics through practical work with devices, Linux, and system integration, including ESP32 experiments and ROS2 communication.",
        "status": "Exploration; no complete system design or security validation claimed."
      },
      "ja": {
        "title": "組み込み・自律システム",
        "summary": "デバイス、Linux、システム統合の実践を通じて、組み込みシステムとロボットを探究。ESP32 の実験や ROS2 通信の検証も含む。",
        "status": "探究段階。完全なシステム設計やセキュリティ検証の主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "esp32",
    "kind": "research",
    "area": "ESP32 · Embedded Security",
    "featured": false,
    "copy": {
      "zh": {
        "title": "ESP32 通訊與安全實驗",
        "summary": "以自製 ESP32 裝置進行通訊協定與安全特性的實驗，探索韌體層的攻擊面與防禦設計。",
        "status": "實驗中；尚無公開安全評估結果。"
      },
      "en": {
        "title": "ESP32 Communication & Security Experiments",
        "summary": "Self-developed ESP32 devices used to explore communication protocols and security properties at the firmware level.",
        "status": "Experiment; no public security assessment results."
      },
      "ja": {
        "title": "ESP32 通信・セキュリティ実験",
        "summary": "自作の ESP32 デバイスで通信プロトコルとファームウェアレベルのセキュリティ特性を探究。",
        "status": "実験中。公開されたセキュリティ評価結果はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "xiaomi-band",
    "kind": "research",
    "area": "Reverse Engineering · Wearables",
    "featured": false,
    "copy": {
      "zh": {
        "title": "小米手環逆向工程",
        "summary": "對小米手環進行通訊協定分析與逆向工程，研究藍牙傳輸資料格式與潛在安全問題。",
        "status": "實驗；尚無公開漏洞或完整分析報告。"
      },
      "en": {
        "title": "Xiaomi Band Reverse Engineering",
        "summary": "Protocol analysis and reverse engineering of the Xiaomi Band, examining Bluetooth data formats and potential security concerns.",
        "status": "Experiment; no published vulnerability or complete analysis report."
      },
      "ja": {
        "title": "Xiaomi Band リバースエンジニアリング",
        "summary": "Xiaomi Band の通信プロトコル解析とリバースエンジニアリング。Bluetooth のデータ形式とセキュリティ上の懸念を調査。",
        "status": "実験中。公開された脆弱性や完全な分析報告はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "aeust-drone",
    "kind": "projects",
    "area": "UAV · Research",
    "featured": false,
    "copy": {
      "zh": {
        "title": "AEUST 無人機研究",
        "summary": "參與亞東科技大學無人機相關研究計畫，涉及飛行控制、系統整合或安全相關工程工作。",
        "status": "研究進行中；未宣稱獨立設計或完成的系統。"
      },
      "en": {
        "title": "AEUST Drone Research",
        "summary": "Participation in drone-related research at AEUST, involving flight systems, system integration, or security-related engineering work.",
        "status": "Research; no claim of sole design or completed system."
      },
      "ja": {
        "title": "AEUST ドローン研究",
        "summary": "亜東科技大学でのドローン関連研究プロジェクトへの参加。飛行制御、システム統合、またはセキュリティ関連の工学作業を含む。",
        "status": "研究進行中。単独設計や完成したシステムの主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "esp32-security-node",
    "kind": "projects",
    "area": "ESP32 · Embedded Security",
    "featured": false,
    "copy": {
      "zh": {
        "title": "ESP32 安全節點",
        "summary": "自行開發的 ESP32 安全裝置，探索韌體層通訊加密與節點驗證機制的工程實作。",
        "status": "原型；未宣稱生產就緒或完整安全評估。"
      },
      "en": {
        "title": "ESP32 Security Node",
        "summary": "A self-developed ESP32 security device exploring firmware-level communication encryption and node authentication.",
        "status": "Prototype; no claim of production readiness or complete security assessment."
      },
      "ja": {
        "title": "ESP32 セキュリティノード",
        "summary": "ファームウェアレベルの通信暗号化とノード認証を探究する、自作の ESP32 セキュリティデバイス。",
        "status": "試作。製品化準備完了や完全なセキュリティ評価の主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "campus-guard",
    "kind": "projects",
    "area": "Security · Anonymous Reporting",
    "featured": false,
    "copy": {
      "zh": {
        "title": "校園匿名守護平台",
        "summary": "校園場景下的匿名通報與安全守護系統，讓師生能安全回報安全疑慮並追蹤處理狀態。",
        "status": "原型；未宣稱部署或臨床驗證。"
      },
      "en": {
        "title": "Campus Anonymous Guard",
        "summary": "An anonymous reporting and safety platform for campus environments, enabling secure submission and case-tracking of safety concerns.",
        "status": "Prototype; no deployment claimed."
      },
      "ja": {
        "title": "キャンパス匿名ガード",
        "summary": "校内の安全懸念を安全に通報し、対応状況を追跡できる匿名通報・安全管理プラットフォーム。",
        "status": "試作。導入の主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "tracelens",
    "kind": "projects",
    "area": "Security · Forensics",
    "featured": false,
    "copy": {
      "zh": {
        "title": "TraceLens",
        "summary": "針對數位鑑識或安全追蹤場景設計的工具，用於記錄、分析或視覺化系統行為與事件軌跡。",
        "status": "原型；未宣稱生產就緒或已驗證鑑識結果。"
      },
      "en": {
        "title": "TraceLens",
        "summary": "A tool designed for digital forensics or security tracing, aimed at recording, analysing, or visualising system behaviour and event trails.",
        "status": "Prototype; no claim of production readiness or validated forensic results."
      },
      "ja": {
        "title": "TraceLens",
        "summary": "デジタルフォレンジックまたはセキュリティ追跡向けのツール。システムの動作やイベントの軌跡を記録・分析・可視化する。",
        "status": "試作。製品化準備完了や検証済みフォレンジック結果の主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "mindtune",
    "kind": "projects",
    "area": "AI · Healthcare",
    "featured": false,
    "copy": {
      "zh": {
        "title": "MindTune",
        "summary": "結合 AI 與心理健康場景的工具原型，探索在隱私與資料邊界下輔助情緒追蹤或心理支持的可能性。",
        "status": "原型；未宣稱臨床效果或醫療認證。"
      },
      "en": {
        "title": "MindTune",
        "summary": "A prototype tool combining AI with mental health contexts, exploring privacy-conscious emotion tracking or support assistance.",
        "status": "Prototype; no clinical efficacy or medical certification claimed."
      },
      "ja": {
        "title": "MindTune",
        "summary": "AI とメンタルヘルスを組み合わせた試作ツール。プライバシーを考慮した感情追跡や支援補助の可能性を探究。",
        "status": "試作。臨床効果や医療認証の主張はありません。"
      }
    }
  },
  // provenance: first-party confirmed 2026-10-02
  {
    "id": "research-intelligence",
    "kind": "projects",
    "area": "AI · Research Tools",
    "featured": false,
    "copy": {
      "zh": {
        "title": "Research Intelligence",
        "summary": "用於輔助研究工作流程的 AI 工具，探索文獻整理、知識萃取或研究問題結構化的自動化可能。",
        "status": "原型；未宣稱已整合進學術工作流程或生產環境。"
      },
      "en": {
        "title": "Research Intelligence",
        "summary": "An AI-assisted tool for research workflows, exploring automation of literature organisation, knowledge extraction, or research question structuring.",
        "status": "Prototype; no claim of academic workflow integration or production use."
      },
      "ja": {
        "title": "Research Intelligence",
        "summary": "研究ワークフロー支援のための AI ツール。文献整理、知識抽出、研究課題の構造化の自動化を探究。",
        "status": "試作。学術ワークフローへの統合や本番利用の主張はありません。"
      }
    }
  }
];
export function publicPortfolio(groups: ArticleGroup[], kind: 'research' | 'projects', featured = false) {
 return portfolio.filter(entry => entry.kind === kind && (!featured || entry.featured)).map(entry => ({ ...entry, group: groups.find(group => group.key === entry.source) }));
}
