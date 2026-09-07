import { createShapeId, Editor, toRichText } from 'tldraw';
import { TemplateDefinition } from '../types';

export const CANVAS_TEMPLATES: TemplateDefinition[] = [
  {
    id: 'flowchart',
    title: 'Process Flowchart',
    description: 'Decision tree with start, process, decision diamond, and end points.',
    category: 'Diagram',
    icon: 'Workflow',
    create: (editor: Editor) => {
      const center = editor.getViewportPageBounds().center;
      const originX = Math.round(center.x - 300);
      const originY = Math.round(center.y - 180);

      const startId = createShapeId();
      const step1Id = createShapeId();
      const decisionId = createShapeId();
      const successId = createShapeId();
      const errorId = createShapeId();
      const endId = createShapeId();

      editor.createShapes([
        // Start Oval
        {
          id: startId,
          type: 'geo',
          x: originX,
          y: originY + 100,
          props: {
            geo: 'ellipse',
            w: 130,
            h: 70,
            richText: toRichText('Start'),
            color: 'green',
            fill: 'semi',
            size: 'm',
          },
        },
        // Step 1 Box
        {
          id: step1Id,
          type: 'geo',
          x: originX + 180,
          y: originY + 95,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 80,
            richText: toRichText('Validate Request'),
            color: 'light-blue',
            fill: 'semi',
            size: 's',
          },
        },
        // Decision Diamond
        {
          id: decisionId,
          type: 'geo',
          x: originX + 390,
          y: originY + 80,
          props: {
            geo: 'diamond',
            w: 140,
            h: 110,
            richText: toRichText('Is Valid?'),
            color: 'yellow',
            fill: 'semi',
            size: 's',
          },
        },
        // Success Step
        {
          id: successId,
          type: 'geo',
          x: originX + 580,
          y: originY + 30,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 75,
            richText: toRichText('Process Order'),
            color: 'green',
            fill: 'semi',
            size: 's',
          },
        },
        // Error Step
        {
          id: errorId,
          type: 'geo',
          x: originX + 580,
          y: originY + 170,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 75,
            richText: toRichText('Log & Retry'),
            color: 'red',
            fill: 'semi',
            size: 's',
          },
        },
        // End Oval
        {
          id: endId,
          type: 'geo',
          x: originX + 790,
          y: originY + 100,
          props: {
            geo: 'ellipse',
            w: 130,
            h: 70,
            richText: toRichText('Completed'),
            color: 'grey',
            fill: 'semi',
            size: 'm',
          },
        },
        // Connecting Arrows
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 130,
          y: originY + 135,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 50, y: 0 },
            color: 'black',
            size: 'm',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 340,
          y: originY + 135,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 50, y: 0 },
            color: 'black',
            size: 'm',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 460,
          y: originY + 80,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 120, y: -15 },
            richText: toRichText('Yes'),
            color: 'green',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 460,
          y: originY + 190,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 120, y: 15 },
            richText: toRichText('No'),
            color: 'red',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 740,
          y: originY + 65,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 50, y: 50 },
            color: 'black',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 740,
          y: originY + 205,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 50, y: -50 },
            color: 'black',
            size: 's',
          },
        },
      ]);

      editor.zoomToFit({ animation: { duration: 350 } });
    },
  },
  {
    id: 'kanban',
    title: 'Sprint Kanban Board',
    description: '3 columns (To Do, In Progress, Done) populated with task sticky notes.',
    category: 'Agile',
    icon: 'Kanban',
    create: (editor: Editor) => {
      const center = editor.getViewportPageBounds().center;
      const originX = Math.round(center.x - 390);
      const originY = Math.round(center.y - 220);

      const colWidth = 240;
      const colHeight = 440;
      const gap = 24;

      editor.createShapes([
        // Column 1 Frame
        {
          id: createShapeId(),
          type: 'geo',
          x: originX,
          y: originY,
          props: {
            geo: 'rectangle',
            w: colWidth,
            h: colHeight,
            color: 'light-violet',
            fill: 'semi',
            richText: toRichText('📋 TO DO'),
            align: 'start',
            verticalAlign: 'start',
            size: 'm',
          },
        },
        // Tasks in Col 1
        {
          id: createShapeId(),
          type: 'note',
          x: originX + 25,
          y: originY + 60,
          props: {
            color: 'yellow',
            richText: toRichText('Design auth flow & session tokens'),
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX + 25,
          y: originY + 240,
          props: {
            color: 'orange',
            richText: toRichText('Write integration test suite'),
            size: 's',
          },
        },
        // Column 2 Frame
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + colWidth + gap,
          y: originY,
          props: {
            geo: 'rectangle',
            w: colWidth,
            h: colHeight,
            color: 'light-blue',
            fill: 'semi',
            richText: toRichText('⚡ IN PROGRESS'),
            align: 'start',
            verticalAlign: 'start',
            size: 'm',
          },
        },
        // Tasks in Col 2
        {
          id: createShapeId(),
          type: 'note',
          x: originX + colWidth + gap + 25,
          y: originY + 60,
          props: {
            color: 'light-blue',
            richText: toRichText('Implement Tldraw SDK infinite canvas'),
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX + colWidth + gap + 25,
          y: originY + 240,
          props: {
            color: 'light-violet',
            richText: toRichText('Configure export engine (PNG & SVG)'),
            size: 's',
          },
        },
        // Column 3 Frame
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + (colWidth + gap) * 2,
          y: originY,
          props: {
            geo: 'rectangle',
            w: colWidth,
            h: colHeight,
            color: 'light-green',
            fill: 'semi',
            richText: toRichText('✅ DONE'),
            align: 'start',
            verticalAlign: 'start',
            size: 'm',
          },
        },
        // Tasks in Col 3
        {
          id: createShapeId(),
          type: 'note',
          x: originX + (colWidth + gap) * 2 + 25,
          y: originY + 60,
          props: {
            color: 'light-green',
            richText: toRichText('Setup project workspace & dependencies'),
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX + (colWidth + gap) * 2 + 25,
          y: originY + 240,
          props: {
            color: 'light-green',
            richText: toRichText('Review UX accessibility and shortcuts'),
            size: 's',
          },
        },
      ]);

      editor.zoomToFit({ animation: { duration: 350 } });
    },
  },
  {
    id: 'architecture',
    title: 'Cloud Architecture',
    description: 'Web client, API gateway, microservices, database, and cache tier.',
    category: 'Diagram',
    icon: 'Cpu',
    create: (editor: Editor) => {
      const center = editor.getViewportPageBounds().center;
      const originX = Math.round(center.x - 380);
      const originY = Math.round(center.y - 190);

      editor.createShapes([
        // Client Apps
        {
          id: createShapeId(),
          type: 'geo',
          x: originX,
          y: originY + 80,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 90,
            richText: toRichText('Web / Mobile Client'),
            color: 'light-blue',
            fill: 'semi',
            size: 's',
          },
        },
        // API Gateway
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 220,
          y: originY + 80,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 90,
            richText: toRichText('API Gateway & Reverse Proxy'),
            color: 'light-violet',
            fill: 'semi',
            size: 's',
          },
        },
        // Arrow to gateway
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 160,
          y: originY + 125,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 60, y: 0 },
            richText: toRichText('HTTPS'),
            color: 'black',
            size: 's',
          },
        },
        // Service 1: App Logic
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 440,
          y: originY,
          props: {
            geo: 'rectangle',
            w: 150,
            h: 75,
            richText: toRichText('App Service'),
            color: 'light-blue',
            fill: 'semi',
            size: 's',
          },
        },
        // Service 2: Worker
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 440,
          y: originY + 100,
          props: {
            geo: 'rectangle',
            w: 150,
            h: 75,
            richText: toRichText('Worker Queue'),
            color: 'light-violet',
            fill: 'semi',
            size: 's',
          },
        },
        // Service 3: AI Service
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 440,
          y: originY + 200,
          props: {
            geo: 'rectangle',
            w: 150,
            h: 75,
            richText: toRichText('AI Service'),
            color: 'yellow',
            fill: 'semi',
            size: 's',
          },
        },
        // Arrows to services
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 380,
          y: originY + 110,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 60, y: -70 },
            color: 'black',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 380,
          y: originY + 125,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 60, y: 15 },
            color: 'black',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 380,
          y: originY + 140,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 60, y: 95 },
            color: 'black',
            size: 's',
          },
        },
        // Database
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 660,
          y: originY + 30,
          props: {
            geo: 'rectangle',
            w: 140,
            h: 80,
            richText: toRichText('Cloud SQL / DB'),
            color: 'light-green',
            fill: 'semi',
            size: 's',
          },
        },
        // Cache
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 660,
          y: originY + 150,
          props: {
            geo: 'rectangle',
            w: 140,
            h: 80,
            richText: toRichText('Redis Cache'),
            color: 'light-red',
            fill: 'semi',
            size: 's',
          },
        },
        // Arrows to DB & Cache
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 590,
          y: originY + 45,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 70, y: 25 },
            color: 'black',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 590,
          y: originY + 140,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 70, y: 45 },
            color: 'black',
            size: 's',
          },
        },
      ]);

      editor.zoomToFit({ animation: { duration: 350 } });
    },
  },
  {
    id: 'mindmap',
    title: 'Mind Map / Brainstorm',
    description: 'Central concept with radiating ideas and grouped notes.',
    category: 'Planning',
    icon: 'Sparkles',
    create: (editor: Editor) => {
      const center = editor.getViewportPageBounds().center;
      const originX = Math.round(center.x);
      const originY = Math.round(center.y);

      const centralId = createShapeId();
      editor.createShapes([
        // Central Node
        {
          id: centralId,
          type: 'geo',
          x: originX - 90,
          y: originY - 50,
          props: {
            geo: 'ellipse',
            w: 180,
            h: 100,
            richText: toRichText('Product Strategy'),
            color: 'light-violet',
            fill: 'solid',
            size: 'm',
          },
        },
        // Node 1: Top Right - UX & Design
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 160,
          y: originY - 160,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 70,
            richText: toRichText('🎨 Design & UX'),
            color: 'light-violet',
            fill: 'semi',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX + 340,
          y: originY - 170,
          props: {
            color: 'light-violet',
            richText: toRichText('Accessibility AA, Dark mode support'),
            size: 's',
          },
        },
        // Arrow to Top Right
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 60,
          y: originY - 30,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 100, y: -90 },
            color: 'light-violet',
            size: 'm',
          },
        },
        // Node 2: Bottom Right - Performance
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 160,
          y: originY + 90,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 70,
            richText: toRichText('⚡ Performance'),
            color: 'yellow',
            fill: 'semi',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX + 340,
          y: originY + 80,
          props: {
            color: 'yellow',
            richText: toRichText('Sub-60fps canvas render, instant state restore'),
            size: 's',
          },
        },
        // Arrow to Bottom Right
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX + 60,
          y: originY + 30,
          props: {
            start: { x: 0, y: 0 },
            end: { x: 100, y: 80 },
            color: 'yellow',
            size: 'm',
          },
        },
        // Node 3: Left - Extensibility
        {
          id: createShapeId(),
          type: 'geo',
          x: originX - 320,
          y: originY - 40,
          props: {
            geo: 'rectangle',
            w: 160,
            h: 70,
            richText: toRichText('🧩 Extensibility'),
            color: 'light-blue',
            fill: 'semi',
            size: 's',
          },
        },
        {
          id: createShapeId(),
          type: 'note',
          x: originX - 500,
          y: originY - 50,
          props: {
            color: 'light-blue',
            richText: toRichText('Custom SDK shape hooks & template library'),
            size: 's',
          },
        },
        // Arrow to Left
        {
          id: createShapeId(),
          type: 'arrow',
          x: originX - 90,
          y: originY,
          props: {
            start: { x: 0, y: 0 },
            end: { x: -70, y: 0 },
            color: 'light-blue',
            size: 'm',
          },
        },
      ]);

      editor.zoomToFit({ animation: { duration: 350 } });
    },
  },
  {
    id: 'wireframe',
    title: 'UI App Wireframe',
    description: 'Frame container with mobile card layout, navigation, and interactive buttons.',
    category: 'Design',
    icon: 'Smartphone',
    create: (editor: Editor) => {
      const center = editor.getViewportPageBounds().center;
      const originX = Math.round(center.x - 170);
      const originY = Math.round(center.y - 250);

      const frameWidth = 340;
      const frameHeight = 520;

      editor.createShapes([
        // Outer Mobile Frame
        {
          id: createShapeId(),
          type: 'frame',
          x: originX,
          y: originY,
          props: {
            w: frameWidth,
            h: frameHeight,
            name: 'Mobile App Wireframe',
          },
        },
        // Header bar
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 16,
          y: originY + 20,
          props: {
            geo: 'rectangle',
            w: frameWidth - 32,
            h: 46,
            richText: toRichText('Canvas Studio'),
            color: 'black',
            fill: 'solid',
            size: 's',
          },
        },
        // Hero Banner
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 16,
          y: originY + 80,
          props: {
            geo: 'rectangle',
            w: frameWidth - 32,
            h: 120,
            richText: toRichText('Create without limits.\nInfinite whiteboard SDK.'),
            color: 'light-blue',
            fill: 'semi',
            size: 's',
          },
        },
        // Card 1
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 16,
          y: originY + 215,
          props: {
            geo: 'rectangle',
            w: (frameWidth - 44) / 2,
            h: 90,
            richText: toRichText('Recent\nProjects (12)'),
            color: 'yellow',
            fill: 'semi',
            size: 's',
          },
        },
        // Card 2
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 24 + (frameWidth - 44) / 2,
          y: originY + 215,
          props: {
            geo: 'rectangle',
            w: (frameWidth - 44) / 2,
            h: 90,
            richText: toRichText('Shared\nBoards (5)'),
            color: 'light-green',
            fill: 'semi',
            size: 's',
          },
        },
        // Action Button
        {
          id: createShapeId(),
          type: 'geo',
          x: originX + 16,
          y: originY + 325,
          props: {
            geo: 'rectangle',
            w: frameWidth - 32,
            h: 44,
            richText: toRichText('+ Create New Board'),
            color: 'light-blue',
            fill: 'solid',
            size: 's',
          },
        },
        // Sticky Note feedback
        {
          id: createShapeId(),
          type: 'note',
          x: originX + frameWidth + 40,
          y: originY + 60,
          props: {
            color: 'yellow',
            richText: toRichText('💡 UX Note: Keep primary actions within thumb reach zone.'),
            size: 's',
          },
        },
      ]);

      editor.zoomToFit({ animation: { duration: 350 } });
    },
  },
];
