import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { ChevronLeft, CheckCircle2, XCircle, Lightbulb, Download, FileText, FileSpreadsheet, FileJson, FileIcon } from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export const ReportPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState<any>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    // Check session storage first (fresh upload)
    const current = sessionStorage.getItem('current_analysis');
    if (current) {
      const parsed = JSON.parse(current);
      if (parsed.id === id) {
        setRecord(parsed);
        return;
      }
    }

    // Fallback to local storage history
    const history = JSON.parse(localStorage.getItem('thumblytics_history') || '[]');
    const found = history.find((h: any) => h.id === id);
    if (found) {
      setRecord(found);
    }
  }, [id]);

  if (!record) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-muted rounded-full mb-4"></div>
          <div className="h-6 w-48 bg-muted rounded mb-2"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportJSON = () => {
    if (!record) return;
    const exportData = {
      filename: record.filename,
      score: record.data.overall_score,
      analysis: record.data
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `analysis-${record.filename}.json`);
  };

  const handleExportExcel = async () => {
    if (!record) return;
    const XLSX = await import('xlsx');
    const wb = XLSX.utils.book_new();
    
    const wsData = [
      ["Thumbnail Analysis Report"],
      ["Filename", record.filename],
      ["Overall Score", record.data.overall_score],
      ["Summary", record.data.summary],
      [],
      ["Metric", "Score"],
      ["Clarity", record.data.clarity],
      ["Contrast", record.data.contrast],
      ["Focus", record.data.focus],
      ["Visual Hierarchy", record.data.visual_hierarchy],
      ["Curiosity", record.data.curiosity],
      ["Mobile Visibility", record.data.mobile_visibility],
      [],
      ["Strengths"],
      ...(record.data.strengths || []).map((s: string) => [s]),
      [],
      ["Weaknesses"],
      ...(record.data.weaknesses || []).map((w: string) => [w]),
      [],
      ["Recommendations"],
      ...(record.data.recommendations || []).map((r: string) => [r])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Analysis");
    XLSX.writeFile(wb, `analysis-${record.filename}.xlsx`);
  };

  const handleExportPDF = async () => {
    if (!record) return;
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(20);
    doc.text("Thumbnail Analysis Report", 20, y);
    y += 10;
    
    doc.setFontSize(12);
    doc.text(`Filename: ${record.filename}`, 20, y);
    y += 8;
    doc.text(`Overall Score: ${record.data.overall_score}/100`, 20, y);
    y += 12;
    
    doc.setFontSize(14);
    doc.text("Summary", 20, y);
    y += 8;
    doc.setFontSize(10);
    const splitSummary = doc.splitTextToSize(record.data.summary, 170);
    doc.text(splitSummary, 20, y);
    y += splitSummary.length * 5 + 10;
    
    doc.setFontSize(14);
    doc.text("Metrics", 20, y);
    y += 8;
    doc.setFontSize(10);
    doc.text(`Clarity: ${record.data.clarity}`, 20, y); y += 6;
    doc.text(`Contrast: ${record.data.contrast}`, 20, y); y += 6;
    doc.text(`Focus: ${record.data.focus}`, 20, y); y += 6;
    doc.text(`Visual Hierarchy: ${record.data.visual_hierarchy}`, 20, y); y += 6;
    doc.text(`Curiosity: ${record.data.curiosity}`, 20, y); y += 10;

    doc.setFontSize(14);
    doc.text("Recommendations", 20, y);
    y += 8;
    doc.setFontSize(10);
    (record.data.recommendations || []).forEach((r: string, i: number) => {
      const splitRec = doc.splitTextToSize(`${i + 1}. ${r}`, 170);
      if (y + (splitRec.length * 5) > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(splitRec, 20, y);
      y += splitRec.length * 5 + 2;
    });
    
    doc.save(`analysis-${record.filename}.pdf`);
  };

  const handleExportDOCX = async () => {
    if (!record) return;
    const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: "Thumbnail Analysis Report",
              heading: HeadingLevel.HEADING_1,
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Filename: ", bold: true }),
                new TextRun(record.filename),
              ],
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Overall Score: ", bold: true }),
                new TextRun(`${record.data.overall_score}/100`),
              ],
            }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Summary", heading: HeadingLevel.HEADING_2 }),
            new Paragraph(record.data.summary),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "Recommendations", heading: HeadingLevel.HEADING_2 }),
            ...(record.data.recommendations || []).map((r: string, i: number) => 
              new Paragraph(`${i + 1}. ${r}`)
            ),
          ],
        },
      ],
    });
    
    Packer.toBlob(doc).then((blob) => {
      downloadBlob(blob, `analysis-${record.filename}.docx`);
    });
  };

  const { data } = record;

  const radarData = [
    { subject: 'Clarity', A: data.clarity, fullMark: 10 },
    { subject: 'Contrast', A: data.contrast, fullMark: 10 },
    { subject: 'Focus', A: data.focus, fullMark: 10 },
    { subject: 'Visual Hierarchy', A: data.visual_hierarchy, fullMark: 10 },
    { subject: 'Curiosity', A: data.curiosity, fullMark: 10 },
    { subject: 'Mobile Vis.', A: data.mobile_visibility, fullMark: 10 },
  ];

  const scoreColor = data.overall_score >= 80 ? "text-green-500" : data.overall_score >= 60 ? "text-amber-500" : "text-destructive";
  const bgScoreColor = data.overall_score >= 80 ? "bg-green-500/10" : data.overall_score >= 60 ? "bg-amber-500/10" : "bg-destructive/10";

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/history" className="p-2 rounded-full hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold truncate max-w-sm" title={record.filename}>{record.filename}</h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowExportMenu(!showExportMenu)}
            onBlur={() => setTimeout(() => setShowExportMenu(false), 200)}
            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:bg-muted transition-colors text-sm font-medium"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
          
          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
              <button onClick={handleExportPDF} className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-3">
                <FileIcon className="w-4 h-4 text-red-500" /> PDF Document
              </button>
              <button onClick={handleExportDOCX} className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-500" /> Word (DOCX)
              </button>
              <button onClick={handleExportExcel} className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-3">
                <FileSpreadsheet className="w-4 h-4 text-green-500" /> Excel (XLSX)
              </button>
              <button onClick={handleExportJSON} className="w-full text-left px-4 py-3 text-sm hover:bg-muted flex items-center gap-3">
                <FileJson className="w-4 h-4 text-amber-500" /> JSON Data
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Score */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {record.image_data && (
              <div className="aspect-video bg-black/5 flex items-center justify-center relative group">
                <img src={record.image_data} alt="Analyzed" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="p-6 text-center border-t border-border">
              <div className="text-sm font-medium text-muted-foreground mb-2">Click Potential Score</div>
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full ${bgScoreColor} ${scoreColor} font-bold text-5xl mb-4 shadow-inner`}>
                {data.overall_score}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.summary}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
            <h3 className="font-semibold border-b border-border pb-2">Key Signals</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Emotion Detected</span>
              <span className="font-medium">{data.emotion || "None"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Text Size</span>
              <span className="font-medium">{data.text_size || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Hook Type</span>
              <span className="font-medium capitalize">{data.thumbnail_hook || "Unknown"}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Analysis */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid sm:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center">
              <h3 className="font-semibold w-full mb-4">Visual Balance</h3>
              <div className="w-full h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--color-muted-foreground)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                    <Radar name="Score" dataKey="A" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-6">
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-green-500">
                  <CheckCircle2 className="w-5 h-5" /> Strengths
                </h3>
                <ul className="space-y-2">
                  {data.strengths?.map((s: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">•</span> {s}
                    </li>
                  ))}
                  {(!data.strengths || data.strengths.length === 0) && <li className="text-sm text-muted-foreground">No prominent strengths identified.</li>}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold flex items-center gap-2 mb-3 text-destructive">
                  <XCircle className="w-5 h-5" /> Weaknesses
                </h3>
                <ul className="space-y-2">
                  {data.weaknesses?.map((w: string, i: number) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="text-destructive mt-0.5">•</span> {w}
                    </li>
                  ))}
                  {(!data.weaknesses || data.weaknesses.length === 0) && <li className="text-sm text-muted-foreground">No prominent weaknesses identified.</li>}
                </ul>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4 text-primary">
              <Lightbulb className="w-5 h-5" /> AI Recommendations to Improve Clicks
            </h3>
            <div className="space-y-3">
              {data.recommendations?.map((rec: string, i: number) => (
                <div key={i} className="bg-card border border-border rounded-lg p-4 text-sm flex gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">{i + 1}</div>
                  <p>{rec}</p>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};
