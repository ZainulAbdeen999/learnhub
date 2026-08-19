const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'seedData.js');
const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

// Find all insertTopic calls with their line numbers
const topicPositions = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/insertTopic\(db,\s*(\d+),\s*'([^']+)'/);
  if (match) {
    topicPositions.push({ line: i, courseId: parseInt(match[1]), title: match[2], topicId: topicPositions.length + 1 });
  }
}

console.log('Found', topicPositions.length, 'topics:');
topicPositions.forEach(t => console.log(`  Topic ${t.topicId} (course ${t.courseId}): "${t.title}" at line ${t.line + 1}`));

// Find all insertLesson calls with their line numbers
const lessonPositions = [];
for (let i = 0; i < lines.length; i++) {
  const match = lines[i].match(/insertLesson\(db,\s*(\d+),\s*'([^']+)'/);
  if (match) {
    lessonPositions.push({ line: i, oldTopicId: parseInt(match[1]), title: match[2] });
  }
}

console.log('\nFound', lessonPositions.length, 'lessons');

// For each lesson, determine which topic it belongs to based on position
let fixes = 0;
for (const lesson of lessonPositions) {
  // Find the last insertTopic that appears before this lesson
  let correctTopicId = null;
  for (const topic of topicPositions) {
    if (topic.line < lesson.line) {
      correctTopicId = topic.topicId;
    } else {
      break;
    }
  }

  if (correctTopicId === null) {
    console.log(`  WARNING: No topic found before lesson "${lesson.title}" at line ${lesson.line + 1}`);
    continue;
  }

  if (lesson.oldTopicId !== correctTopicId) {
    const oldStr = `insertLesson(db, ${lesson.oldTopicId},`;
    const newStr = `insertLesson(db, ${correctTopicId},`;
    
    // Find the exact occurrence on this specific line
    const lineContent = lines[lesson.line];
    if (lineContent.includes(oldStr)) {
      lines[lesson.line] = lineContent.replace(oldStr, newStr);
      fixes++;
      console.log(`  FIXED: "${lesson.title}" line ${lesson.line + 1}: topicId ${lesson.oldTopicId} -> ${correctTopicId}`);
    } else {
      console.log(`  SKIP: "${lesson.title}" line ${lesson.line + 1}: pattern not found on line`);
    }
  }
}

console.log(`\nTotal fixes: ${fixes}`);

// Write the fixed content back
fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
console.log('File written successfully.');
