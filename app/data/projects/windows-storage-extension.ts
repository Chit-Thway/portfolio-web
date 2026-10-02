import type { ProjectDefinition } from "./types";


export const windowsStorageExtensionDefinition = {
  project: {
    id: "windows-storage-extension",
    number: "01B",
    title: "Storage Insights & Guided Cleanup",
    category: "Windows support extension",
    status: "Completed · Public repository",
    summary:
      "A local storage-analysis extension that explains where drive space is used, supports focused file and folder review, and keeps cleanup deliberate and recoverable.",
    contribution:
      "Extended the Windows support workflow with explicit metadata-only scanning, versioned report contracts, non-overlapping drive accounting, file-type and ranked-folder exploration, and guarded Recycle Bin cleanup with live revalidation.",
    employerSignal:
      "Demonstrates safety-focused feature expansion, transparent data modelling, careful handling of partial Windows evidence, and the ability to turn a broad disk-space warning into a practical support workflow.",
    technologies: [
      "Python",
      "Flask",
      "JavaScript",
      "JSON Schema",
      "Pytest",
      "Windows",
    ],
    highlights: [
      "Non-overlapping drive-space accounting",
      "File-type and ranked-folder exploration",
      "Revalidated Recycle Bin-only cleanup",
    ],
    links: [
      {
        label: "View repository",
        href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit",
      },
    ],
    home: {
      section: "projects",
      order: 2,
      label: "Windows support extension · Public",
      description:
        "A local extension that explains where drive space is used, narrows the review by file type or folder and keeps cleanup recoverable.",
      contribution:
        "Built the storage contracts, metadata-only scanners, review interfaces and guarded Recycle Bin workflow.",
      outcome: "Storage evidence made safe to review",
      size: "standard",
      media: {
        kind: "image",
        src: "/projects/windows-storage-extension/thumbnail.png",
        alt: "Storage Insights dashboard showing non-overlapping drive-space categories",
      },
      tools: ["python", "windows", "qa"],
    },
  },
  caseStudy: {
    eyebrow: "Windows support extension",
    introduction:
      "A local storage-analysis and guided-cleanup extension that turns a broad disk-space warning into clear evidence, focused review and deliberately recoverable action.",
    media: {
      kind: "video",
        src: "/projects/windows-storage-extension/demonstration.mp4?v=5260c1b9",
      label: "Storage Insights and Guided Cleanup demonstration",
      duration: "43 second demonstration",
    },
    stack: {
      subtitle: "Local storage evidence and guarded cleanup workflow",
      mark: "python",
      groups: [
        {
          label: "Analysis",
          items: [
            { name: "Python", icon: "python" },
            { name: "Windows", icon: "windows" },
          ],
        },
        {
          label: "Interface",
          items: [
            { name: "Flask", icon: "python" },
            { name: "HTML", icon: "html" },
            { name: "CSS", icon: "css" },
            { name: "JavaScript", icon: "javascript" },
          ],
        },
        {
          label: "Contracts",
          items: [
            { name: "JSON Schema", icon: "json" },
            { name: "Versioned reports", icon: "database" },
          ],
        },
        {
          label: "Quality",
          items: [
            { name: "Pytest", icon: "pytest" },
            { name: "Safety validation", icon: "shield" },
          ],
        },
      ],
      description:
        "Explicit Python scanners produce validated local reports for a loopback-only Flask interface, while deterministic policy and immediate revalidation guard every cleanup action.",
    },
    actions: [
      {
        label: "View extension branch",
        href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/tree/storage-extension-v2-ui-polish",
      },
    ],
    journey: {
      title: "How this extension grew",
      showLinks: false,
      items: [
        {
          kind: "Problem",
          label: "Initial Problem",
          title: "A warning without a next step",
          detail:
            "The diagnostic dashboard could identify low disk space, but it could not show where the space had gone or help the user decide what to review next.",
          link: {
            label: "Open the storage extension roadmap",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md",
          },
        },
        {
          kind: "Solution",
          label: "First idea",
          title: "Find old files",
          detail:
            "Scan file metadata, mark anything unchanged for 730 days as Stale, identify large, empty, temporary or incomplete files, and let the user filter candidates for reviewed Recycle Bin cleanup.",
          link: {
            label: "Open the original classification model",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/storage/README.md#classification-settings",
          },
        },
        {
          kind: "Result",
          title: "The age-led prototype worked",
          detail:
            "The first extension produced metadata-only reports, displayed candidate files, supported Match all and Match any filtering, and added an exact-path preview before moving selected eligible files to the Recycle Bin.",
          link: {
            label: "Open the initial guided-cleanup implementation",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/8",
          },
        },
        {
          kind: "Problem",
          title: "Old did not mean disposable",
          detail:
            "An untouched file could still be a game save, configuration, installer, database, application asset or personal archive. Modification age explained when something changed—not whether it remained important.",
          link: {
            label: "Open the storage safety principles",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#safety-principles",
          },
        },
        {
          kind: "Solution",
          title: "Separate clues from permission",
          detail:
            "Candidate evidence, technical eligibility and removal risk became separate concepts. High-risk application data, saves, installers, databases, configuration files and protected locations remained visible but could not be selected.",
          link: {
            label: "Open the Milestone 7 hardening work",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/9",
          },
        },
        {
          kind: "Problem",
          title: "The totals were misleading",
          detail:
            "Logical file length did not always equal physical disk use. Hard links could be counted more than once, inaccessible space remained unknown and bounded candidate rows could hide important files.",
          link: {
            label: "Open the storage accounting contract",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/storage-report-contract.md",
          },
        },
        {
          kind: "Solution",
          title: "Measure physical use properly",
          detail:
            "The scanner adopted Windows allocated-size metadata, stable file identities for hard-link deduplication, explicit unclassified space and deterministic retention favouring physically larger and safer candidates.",
          link: {
            label: "Open the physical-accounting changes",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/9",
          },
        },
        {
          kind: "Problem",
          title: "Folders made everything harder",
          detail:
            "Grouping files into folders reduced the number of rows, but parent and child totals overlapped, stale folders repeated evidence, and one changed or inaccessible descendant could invalidate an action.",
          link: {
            label: "Open the folder-analysis amendment",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#milestone-8--folder-analysis-amendment",
          },
        },
        {
          kind: "Solution",
          title: "Harden the folder experiment",
          detail:
            "Equivalent stale chains were collapsed, overlapping parent-and-child selections were rejected, risky trees became review-only, and every descendant was revalidated using a metadata-only fingerprint.",
          link: {
            label: "Open the folder cleanup safeguards",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/guided-cleanup.md#immediate-safety-checks",
          },
        },
        {
          kind: "Problem",
          title: "It was still the wrong question",
          detail:
            "Even after extensive safeguards, the workflow still centred on which old files could be removed. That remained uncertain and did not help users explore storage through things they recognized.",
          link: {
            label: "Open the recorded product-direction change",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md#milestone-8--folder-analysis-amendment",
          },
        },
        {
          kind: "Solution",
          badge: "Unexpected idea",
          title: "Pivot to file types",
          detail:
            "The project became a File-Type Explorer: scan each drive once, group recognizable extensions, rank folders by matching content, choose non-overlapping scopes and inspect exact files without treating age as permission.",
          link: {
            label: "Open the File-Type Explorer contract",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/file-type-index-contract.md",
          },
        },
        {
          kind: "Problem",
          title: "Filtering could not rescan the drive",
          detail:
            "A whole-drive traversal could be slow or partial. Repeating it whenever the user selected Documents, Videos, Archives or another extension group would make the explorer impractical.",
          link: {
            label: "Open the whole-drive indexer pull request",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/pull/10",
          },
        },
        {
          kind: "Solution",
          title: "Scan once, filter many times",
          detail:
            "A separate per-drive index stores exact folder and preset-extension aggregates from one metadata-only traversal. File details can remain bounded while filters and ranked folder totals stay truthful without another scan.",
          link: {
            label: "Open the whole-drive index design",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/docs/file-type-index-contract.md#create-a-local-index",
          },
        },
        {
          kind: "Result",
          title: "A review system, not a cleaner",
          detail:
            "The final extension helps users understand storage by familiar file types, narrow the search to exact folders and files, and move only explicitly reviewed, unchanged, eligible items to the Recycle Bin.",
          link: {
            label: "Open the sanitized demonstration",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/portfolio-demo/toolkit-sanitized-preview.gif",
          },
        },
        {
          kind: "Lesson",
          title: "Guardrails cannot fix the wrong model",
          detail:
            "The age-led version grew increasingly complicated as protections were added. The stronger solution came from changing the organizing idea—from predicting disposability to helping users explore recognizable evidence.",
          link: {
            label: "Open the storage extension history",
            href: "https://github.com/Chit-Thway/windows-support-diagnostic-toolkit/blob/storage-extension-v2-ui-polish/STORAGE_EXTENSION_PLAN.md",
          },
        },
      ],
    },
    facts: [
      { label: "Status", value: "Extension complete" },
      { label: "Environment", value: "Windows / local only" },
      { label: "Analysis", value: "Metadata only" },
      { label: "Cleanup", value: "Recycle Bin only" },
    ],
    overview: [
      "Storage Insights extends the diagnostic toolkit beyond a simple low-space warning. An explicitly started scanner records local file metadata, drive capacity, coverage and inaccessible paths, then presents non-overlapping categories that explain where physical drive space is being used without pretending partial evidence is complete.",
      "The dashboard supports individual-file, folder and file-type exploration. Stored aggregates let filters and ranked folders update without silently rescanning the drive, while protected locations, review-only items and incomplete coverage remain visible instead of being simplified into unsafe cleanup recommendations.",
      "Selecting an item changes nothing. Cleanup requires a separate exact-path preview and explicit confirmation, followed by immediate checks of scope, metadata, risk and reparse-point state. Eligible unchanged items are sent to the Windows Recycle Bin; permanent deletion is never used as a fallback.",
    ],
    setup: {
      introduction:
        "This example analyses one drive. Replace C:\\ with the drive you want to review; repeat it with different output names only when you need another drive.",
      requirements: [
        "Windows PowerShell 5.1",
        "Python 3.10+",
        "Git or a downloaded repository ZIP",
      ],
      steps: [
        {
          title: "Set up the project once",
          detail: "Open PowerShell in the downloaded project folder, then create the local environment and install its requirements.",
          command:
            "python -m venv .venv\n.\\.venv\\Scripts\\Activate.ps1\npython -m pip install -r requirements-dev.txt",
        },
        {
          title: "Generate the three local reports",
          detail: "Create the Windows report, storage analysis and File-Type Explorer index. Change C:\\ to the drive you want to inspect.",
          command:
            "powershell.exe -NoProfile -ExecutionPolicy Bypass -File '.\\collector\\Collect-Diagnostics.ps1' -OutputPath '.\\reports\\first-report.json'\npython -m storage --root 'C:\\' --output 'selected-drive-report.json'\npython -m storage.file_type_indexer --drive 'C:\\' --output 'selected-drive-file-types.json'",
        },
        {
          title: "Open everything together",
          detail: "Start the private local dashboard with the three reports you just created, then open the local address shown in PowerShell.",
          command:
            "python -m dashboard --report '.\\reports\\first-report.json' --storage-report '.\\storage-reports\\selected-drive-report.json' --file-type-index '.\\storage-reports\\selected-drive-file-types.json'\nhttp://127.0.0.1:5000",
        },
      ],
    },
    decisions: [
      {
        title: "Make every scan explicit",
        detail:
          "The dashboard never starts a filesystem scan silently. Users select the roots and run the scanner themselves, keeping scope and cost visible.",
      },
      {
        title: "Keep the accounting honest",
        detail:
          "Drive categories do not overlap, partial scans disclose their limits and folder hierarchy totals are never misrepresented as uniquely recoverable physical space.",
      },
      {
        title: "Separate review from action",
        detail:
          "Filters, selections and previews remain read-only. Cleanup requires another confirmation and live revalidation before Windows receives a Recycle Bin request.",
      },
      {
        title: "Fail toward safety",
        detail:
          "Protected paths, reparse points, changed files, review-only risks and incomplete evidence disable cleanup rather than being treated as permission to proceed.",
      },
    ],
    note:
      "This extension analyses local metadata and supports guided review; it does not claim that an old or large item is safe to remove. Recycle Bin recovery remains controlled by Windows.",
  },
} satisfies ProjectDefinition;
