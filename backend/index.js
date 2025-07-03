const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
console.log("⏳ Connecting to MongoDB...");
mongoose.connect('mongodb+srv://dev-xam-india:jfIVHO8gEknnJRuL@cbt-dev-tenant-xam-indi.2pos5.mongodb.net/xam-india?retryWrites=true&w=majority');

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
  console.log('✅ Connected to MongoDB Atlas');
});

const CandidateSchema = new mongoose.Schema({}, { strict: false });
const Candidate = mongoose.model('Candidate', CandidateSchema, 'AWES-CANDIDATE');
const applications = mongoose.model('Application', CandidateSchema, 'Candidate');
//Total Registered candidate
app.get('/api/summary/total-candidates', async (req, res) => {
  try {
    const totalCandidates = await applications.countDocuments();
    res.json({ total: totalCandidates });
  } catch (err) {
    console.error('❌ Error fetching total candidates:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ✅ Summary routes
app.get('/api/summary/post', async (req, res) => {
  try {
    const result = await Candidate.aggregate([
      { $match: { post: { $exists: true, $ne: "" } } },
      { $group: { _id: "$post", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/stream', async (req, res) => {
  try {
    const result = await Candidate.aggregate([
      { $match: { stream: { $exists: true, $ne: "" } } },
      { $group: { _id: "$stream", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/gender', async (req, res) => {
  try {
    const result = await Candidate.aggregate([
      { $match: { gender: { $exists: true, $ne: "" } } },
      { $group: { _id: "$gender", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/total', async (req, res) => {
  try {
    const total = await Candidate.countDocuments({});
    res.json({ totalApplications: total });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/disability', async (req, res) => {
  try {
    const count = await Candidate.countDocuments({ personWithBenchmarkDisability: "Yes" });
    res.json({ disabilityYesCount: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/isfeepaid', async (req, res) => {
  try {
    const count = await Candidate.countDocuments({ isFeePaid: true });
    res.json({ isFeePaid: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

app.get('/api/summary/isfeepending', async (req, res) => {
  try {
    const count = await Candidate.countDocuments({ isFeePaid: false });
    res.json({ isFeePending: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});



// ✅ Page-wise candidate count (pending payment only)
const getPageCounts = async (req, res, page) => {
  try {
    const candidates = await Candidate.find({ isFeePaid: false }, { completedPages: 1 });
    let count = 0;

    candidates.forEach(c => {
      const pages = (c.completedPages || []).map(p => String(p));
      if (
        (page === '1' && pages.includes('1') && !pages.includes('2') && !pages.includes('3')) ||
        (page === '2' && pages.includes('2') && !pages.includes('3')) ||
        (page === '3' && pages.includes('3'))
      ) {
        count++;
      }
    });

    res.json({ [`completedPage${page}Count`]: count });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

app.get('/api/summary/completed-page-1', (req, res) => getPageCounts(req, res, '1'));
app.get('/api/summary/completed-page-2', (req, res) => getPageCounts(req, res, '2'));
app.get('/api/summary/completed-page-3', (req, res) => getPageCounts(req, res, '3'));

// ✅ Drill-down chart: Stream → Gender
app.get('/api/drilldown/stream-gender', async (req, res) => {
  try {
    const candidates = await Candidate.find({}, { stream: 1, gender: 1 });
    const streamMap = {}, genderMap = {};

    candidates.forEach(({ stream = 'Unknown', gender = 'Unknown' }) => {
      const normStream = stream.replace(/[^a-zA-Z0-9]/g, '_');
      streamMap[stream] = (streamMap[stream] || 0) + 1;
      const key = `stream-${normStream}`;
      genderMap[key] = genderMap[key] || {};
      genderMap[key][gender] = (genderMap[key][gender] || 0) + 1;
    });

    const topLevelData = Object.entries(streamMap).map(([label, value]) => ({
      label,
      value,
      link: `newchart-json-stream-${label.replace(/[^a-zA-Z0-9]/g, '_')}`
    }));

    const linkeddata = Object.entries(genderMap).map(([id, genders]) => ({
      id,
      linkedchart: {
        chart: {
          caption: `Gender Distribution under ${id.replace('stream-', '').replace(/_/g, ' ')}`,
          theme: "fusion"
        },
        data: Object.entries(genders).map(([label, value]) => ({ label, value }))
      }
    }));

    res.json({
      chart: {
        caption: "Stream-wise Applications",
        xAxisName: "Stream",
        yAxisName: "Applications",
        theme: "fusion",
        showBackBtn: "1",
        backBtnText: "← Back"
      },
      data: topLevelData,
      linkeddata
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});
// DrillDown Fee-Post
app.get('/api/drilldown/fee-post', async (req, res) => {
  try {
    const candidates = await Candidate.find({}, {
      isFeePaid: 1,
      post: 1
    });

    const sanitize = str => (str || "Unknown").replace(/[^a-zA-Z0-9]/g, '_');

    const feeCounts = { Paid: 0, Unpaid: 0 };
    const postMap = {}; // fee → post count

    for (const c of candidates) {
      const feeStatus = c.isFeePaid ? 'Paid' : 'Unpaid';
      const post = sanitize(c.post);
      const feeId = `fee-${feeStatus}`;

      // Level 1
      feeCounts[feeStatus]++;

      // Level 2
      postMap[feeId] = postMap[feeId] || {};
      postMap[feeId][post] = (postMap[feeId][post] || 0) + 1;
    }

    const topData = Object.entries(feeCounts).map(([status, count]) => ({
      label: status === 'Paid' ? 'Fee Paid' : 'Fee Pending',
      value: count,
      link: `newchart-json-fee-${status}`
    }));

    const linkeddata = Object.entries(postMap).map(([feeId, map]) => ({
      id: feeId,
      linkedchart: {
        chart: {
          caption: `Post Breakdown`,
          theme: "fusion"
        },
        data: Object.entries(map).map(([postLabel, count]) => ({
          label: postLabel.replace(/_/g, ' '),
          value: count
        }))
      }
    }));

    res.json({
      chart: {
        caption: "Fee Status wise Applications",
        xAxisName: "Category",
        yAxisName: "Count",
        theme: "fusion",
        showBackBtn: "1",
        backBtnText: "← Back"
      },
      data: topData,
      linkeddata
    });

  } catch (err) {
    console.error("❌ Error in /fee-post route:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ Drill-down chart: Post → City
app.get('/api/drilldown/post-city', async (req, res) => {
  try {
    const candidates = await Candidate.find({}, { post: 1, cityTown: 1 });
    const postMap = {}, cityMap = {};

    candidates.forEach(({ post = 'Unknown', cityTown = 'Unknown' }) => {
      const normPost = post.replace(/[^a-zA-Z0-9]/g, '_');
      postMap[post] = (postMap[post] || 0) + 1;
      const key = `post-${normPost}`;
      cityMap[key] = cityMap[key] || {};
      cityMap[key][cityTown] = (cityMap[key][cityTown] || 0) + 1;
    });

    const topLevelData = Object.entries(postMap).map(([label, value]) => ({
      label,
      value,
      link: `newchart-json-post-${label.replace(/[^a-zA-Z0-9]/g, '_')}`
    }));

    const linkeddata = Object.entries(cityMap).map(([id, cities]) => ({
      id,
      linkedchart: {
        chart: {
          caption: `Cities under ${id.replace('post-', '').replace(/_/g, ' ')}`,
          theme: "fusion"
        },
        data: Object.entries(cities).map(([label, value]) => ({ label, value }))
      }
    }));

    res.json({
      chart: {
        caption: "Post-wise Applications",
        xAxisName: "Post",
        yAxisName: "Applications",
        theme: "fusion",
        showBackBtn: "1",
        backBtnText: "← Back"
      },
      data: topLevelData,
      linkeddata
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});


//Post -> Stream only
app.get('/api/drilldown/post-stream-gender', async (req, res) => {
  try {
    console.log('📥 API Called: /api/drilldown/post-stream-gender');
    console.log('⏳ Fetching post and stream fields...');

    const candidates = await Candidate.find({}, { post: 1, stream: 1 });
    console.log(`🔍 Total Records Fetched: ${candidates.length}`);

    const postMap = {};
    const streamMap = {};

    candidates.forEach(({ post = 'Unknown', stream = 'Unknown' }) => {
      const normPost = post.replace(/[^a-zA-Z0-9]/g, '_');

      // Level 1: Post
      postMap[post] = (postMap[post] || 0) + 1;

      // Level 2: Stream under Post
      const streamKey = `post-${normPost}`;
      streamMap[streamKey] = streamMap[streamKey] || {};
      streamMap[streamKey][stream] = (streamMap[streamKey][stream] || 0) + 1;
    });

    // 🚩 Print Level 1 Data
    console.log("📊 Level 1 (Post):", postMap);

    // 🚩 Print Level 2 Data
    console.log("📊 Level 2 (Stream under Post):");
    Object.entries(streamMap).forEach(([key, val]) => {
      console.log(`${key}:`, val);
    });

    // Top level (Post)
    const topLevelData = Object.entries(postMap).map(([post, count]) => {
      const normPost = post.replace(/[^a-zA-Z0-9]/g, '_');
      return {
        label: post,
        value: count,
        link: `newchart-json-post-${normPost}`
      };
    });

    const linkeddata = [];

    // Level 2 (Stream only)
    for (const postKey in streamMap) {
      const postLabel = postKey.replace('post-', '').replace(/_/g, ' ');
      const normPost = postKey.replace('post-', '');
      const streams = streamMap[postKey];

      const streamData = Object.entries(streams).map(([stream, count]) => {
        return {
          label: stream,
          value: count
        };
      });

      linkeddata.push({
        id: postKey,
        linkedchart: {
          chart: {
            caption: `Streams under ${postLabel}`,
            theme: "fusion"
          },
          data: streamData
        }
      });
    }

    console.log('✅ Drill-down chart (Post → Stream) prepared and sent.');

    res.json({
      chart: {
        caption: "Post-wise Applications",
        xAxisName: "Post",
        yAxisName: "Applications",
        theme: "fusion"
      },
      data: topLevelData,
      linkeddata
    });

  } catch (err) {
    console.error("❌ Drill-down generation error:", err);
    res.status(500).json({ message: 'Server Error' });
  }
});


// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
