# CBAM (Carbon Border Adjustment Mechanism) Calculation & Reporting Tool

An end-to-end full-stack web application designed for processing client Excel/CSV emissions data, validating EU CBAM compliance metrics, calculating embedded direct & indirect emissions, and generating downloadable Word compliance reports.

## Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- TanStack Query (React Query)
- TanStack Table
- Axios

### Backend
- Node.js & Express.js
- Prisma ORM & PostgreSQL
- SheetJS (`xlsx`) & Multer (File Upload & Parsing)
- BullMQ & Redis (Asynchronous Job Queue)
- `docx` (Word Report Generation Engine)

---

## 5-Step CBAM Workflow
1. **Upload Excel/CSV**: Client uploads raw emissions dataset.
2. **Provide & Structure Data**: Map client data columns to standard CBAM template schema.
3. **Validate Data**: Check for missing required parameters (CN codes, production quantity, emissions).
4. **CBAM Calculation**: Perform embedded direct + indirect emission calculations and benchmark comparisons.
5. **Generate Final Report**: Output structured Word (`.docx`) report for review and download.

---

## Getting Started

### Backend Setup
```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
