import GramSevakAssignedIssue from '../models/GramSevakAssignedIssue.js';
import GramSevakIssue from '../models/GramSevakIssue.js';

/**
 * CREATE GramSevakAssignedIssue
 */
export const createGramSevakAssignedIssue = async (req, res) => {
  try {
    console.log("viki lale", req.body);

    const {
      type,
      description,
      location,
      images,
      votes,
      priority,
      assignedTo,
      status,
      comments,
      proofPhotos,
      originalIssueId
    } = req.body;

    // 🔴 REQUIRED FIELDS CHECK
    if (!type || !description || !assignedTo || !originalIssueId) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    // ✅ Convert location → GeoJSON
    let geoLocation = {
      type: "Point",
      coordinates: []
    };

    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number"
    ) {
      geoLocation.coordinates = [location.lng, location.lat];
    }

    const newAssignedIssue = new GramSevakAssignedIssue({
      type,
      description,
      location: geoLocation,
      images: Array.isArray(images) ? images : [],
      votes: Array.isArray(votes) ? votes : [],
      priority: priority || null,
      assignedTo,
      status: status || "in-progress",
      comments: Array.isArray(comments)
        ? comments.map(c => ({
            text: c.text,
            date: c.date || new Date().toLocaleDateString("hi-IN"),
            time: c.time || new Date().toLocaleTimeString("hi-IN")
          }))
        : [],
      proofPhotos: Array.isArray(proofPhotos) ? proofPhotos : [],
      originalIssueId
    });

    await newAssignedIssue.save();

    return res.status(201).json({
      success: true,
      message: "GramSevakAssignedIssue created successfully",
      data: newAssignedIssue
    });

  } catch (error) {
    console.error("Create GramSevakAssignedIssue Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating assigned issue"
    });
  }
};


/**
 * UPDATE GramSevakIssue STATUS
 */
export const GramSevekStatusUpdate = async (req, res) => {
  try {
    const { id, status } = req.params;

    const updated = await GramSevakIssue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    console.log(updated)

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "GramSevakIssue not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Status updated successfully",
      data: updated
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating status"
    });
  }
};


// Get all issues completed by Gram Sevak
export const GetAllGramsevekCompletedIssue = async (req, res) => {
  try {
    // Fetch only those issues where status is 'Completed'
    const gramSevakCompletedIssues = await GramSevakAssignedIssue.find({ 
      status: 'Completed' 
    });
    console.log(gramSevakCompletedIssues);
    // If no completed issues found
    if (gramSevakCompletedIssues.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No completed issues found',
        data: []
      });
    }

    // Return success response with data
    return res.status(200).json({
      success: true,
      message: 'Completed issues fetched successfully',
      count: gramSevakCompletedIssues.length,
      data: gramSevakCompletedIssues
    });
  } catch (err) {
    console.error('Error fetching Gram Sevak completed issues:', err);
    
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching completed issues',
      error: err.message
    });
  }
};


























