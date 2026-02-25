// src/pages/Profile.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit3, 
  Download, 
  Building2, 
  GraduationCap, 
  UserCircle, 
  Save, 
  X, 
  Plus,
  Camera,
  Check
} from "lucide-react";
import { studentData, facultyData, industryData } from "../data/mockData";
import { useToast } from "../context/ToastContext";

const ProfilePage = ({ userRole, navigate }) => {
  if (userRole === "faculty") return <FacultyProfile navigate={navigate} />;
  if (userRole === "industry") return <IndustryProfile navigate={navigate} />;
  return <StudentProfile navigate={navigate} />;
};

/* ==================== STUDENT PROFILE ==================== */
const StudentProfile = ({ navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const { showSuccess, showError, showInfo } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: studentData.name,
    branch: studentData.branch,
    college: studentData.college,
    email: studentData.email,
    phone: "+91 98765 43210",
    about: "Passionate computer science student with a keen interest in web development and machine learning.",
    skills: [...studentData.skills],
    github: "github.com/aditya",
    linkedin: "linkedin.com/in/aditya",
    portfolio: "aditya.dev"
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
    showInfo("You can now edit your profile", "Edit Mode");
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    showSuccess("Your profile has been updated successfully!", "Profile Saved");
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
    showInfo("Changes discarded", "Cancelled");
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !tempData.skills.includes(newSkill.trim())) {
      setTempData({ ...tempData, skills: [...tempData.skills, newSkill.trim()] });
      showSuccess(`"${newSkill.trim()}" added to your skills!`, "Skill Added");
      setNewSkill("");
      setShowSkillModal(false);
    } else if (tempData.skills.includes(newSkill.trim())) {
      showError("This skill already exists!", "Duplicate Skill");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setTempData({ 
      ...tempData, 
      skills: tempData.skills.filter(skill => skill !== skillToRemove) 
    });
    showInfo(`"${skillToRemove}" removed from skills`, "Skill Removed");
  };

  const currentData = isEditing ? tempData : profileData;

  return (
    <ProfileCard>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <ProfileHeader
          initials={currentData.name}
          title={currentData.name}
          subtitle={`${currentData.branch} • ${currentData.college}`}
          extra={currentData.email}
          icon={GraduationCap}
          isEditing={isEditing}
          onNameChange={(value) => setTempData({ ...tempData, name: value })}
        />
        
        <div className="flex gap-2 w-full md:w-auto">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-all"
              >
                <Save size={18} />
                Save
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] rounded-xl font-medium border border-[rgb(var(--border))]"
              >
                <X size={18} />
                Cancel
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
            >
              <Edit3 size={18} />
              Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      {/* About Section */}
      <Section title="About">
        {isEditing ? (
          <textarea
            value={tempData.about}
            onChange={(e) => setTempData({ ...tempData, about: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:ring-2 focus:ring-blue-500 outline-none resize-none"
          />
        ) : (
          <p className="text-[rgb(var(--muted))] leading-relaxed">{currentData.about}</p>
        )}
      </Section>

      {/* Contact Info */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField
            label="Email"
            value={currentData.email}
            isEditing={isEditing}
            onChange={(value) => setTempData({ ...tempData, email: value })}
            type="email"
          />
          <EditableField
            label="Phone"
            value={currentData.phone}
            isEditing={isEditing}
            onChange={(value) => setTempData({ ...tempData, phone: value })}
          />
          <EditableField
            label="Branch"
            value={currentData.branch}
            isEditing={isEditing}
            onChange={(value) => setTempData({ ...tempData, branch: value })}
          />
          <EditableField
            label="College"
            value={currentData.college}
            isEditing={isEditing}
            onChange={(value) => setTempData({ ...tempData, college: value })}
          />
        </div>
      </Section>

      {/* Skills Section */}
      <Section title="Skills">
        <div className="flex flex-wrap gap-3">
          {currentData.skills.map((skill) => (
            <motion.span
              key={skill}
              layout
              className={`px-4 py-2 rounded-xl text-white font-medium bg-linear-to-r from-blue-500 to-green-400 flex items-center gap-2`}
            >
              {skill}
              {isEditing && (
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                >
                  <X size={12} />
                </button>
              )}
            </motion.span>
          ))}
          {isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowSkillModal(true)}
              className="px-4 py-2 rounded-xl border-2 border-dashed border-[rgb(var(--border))] text-[rgb(var(--muted))] hover:border-blue-500 hover:text-blue-500 transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              Add Skill
            </motion.button>
          )}
        </div>
      </Section>

      {/* Stats */}
      <Section title="Statistics">
        <StatsGrid
          stats={[
            ["Credits", `${studentData.credits}/${studentData.totalCredits}`],
            ["Internships", studentData.internships],
            ["Skill Match", `${studentData.skillMatch}%`],
            ["Projects", "5"],
          ]}
        />
      </Section>

      {/* Action Buttons */}
      {!isEditing && (
        <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-[rgb(var(--border))]">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => showSuccess("Resume downloaded!", "Download Started")}
            className="flex items-center gap-2 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] px-6 py-3 rounded-xl font-semibold border border-[rgb(var(--border))]"
          >
            <Download size={18} />
            Download Resume
          </motion.button>
        </div>
      )}

      {/* Add Skill Modal */}
      <AnimatePresence>
        {showSkillModal && (
          <Modal onClose={() => setShowSkillModal(false)}>
            <h3 className="text-xl font-bold text-[rgb(var(--foreground))] mb-4">Add New Skill</h3>
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
              placeholder="e.g., React, Python, Machine Learning"
              className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] text-[rgb(var(--foreground))] focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddSkill}
                className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-xl font-medium"
              >
                Add Skill
              </motion.button>
              <button
                onClick={() => setShowSkillModal(false)}
                className="px-4 py-2.5 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] rounded-xl border border-[rgb(var(--border))]"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </ProfileCard>
  );
};

/* ==================== FACULTY PROFILE ==================== */
const FacultyProfile = ({ navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess, showInfo } = useToast();
  
  const [profileData, setProfileData] = useState({
    name: facultyData.name,
    designation: facultyData.designation,
    department: facultyData.department,
    college: facultyData.college,
    email: facultyData.email || "prof.mehta@college.edu",
    phone: "+91 98765 43210",
    about: "Experienced faculty member specializing in Computer Science.",
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    showSuccess("Profile updated successfully!", "Saved");
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
    showInfo("Changes discarded", "Cancelled");
  };

  const currentData = isEditing ? tempData : profileData;

  return (
    <ProfileCard>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <ProfileHeader
          initials={currentData.name}
          title={currentData.name}
          subtitle={`${currentData.designation} • ${currentData.department}`}
          extra={currentData.college}
          icon={UserCircle}
          isEditing={isEditing}
          onNameChange={(value) => setTempData({ ...tempData, name: value })}
        />
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <motion.button onClick={handleSave} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium">
                <Save size={18} /> Save
              </motion.button>
              <motion.button onClick={handleCancel} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))]">
                <X size={18} /> Cancel
              </motion.button>
            </>
          ) : (
            <motion.button onClick={handleEdit} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium">
              <Edit3 size={18} /> Edit Profile
            </motion.button>
          )}
        </div>
      </div>

      <Section title="About">
        {isEditing ? (
          <textarea value={tempData.about} onChange={(e) => setTempData({ ...tempData, about: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        ) : (
          <p className="text-[rgb(var(--muted))]">{currentData.about}</p>
        )}
      </Section>

      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField label="Email" value={currentData.email} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, email: v })} />
          <EditableField label="Phone" value={currentData.phone} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, phone: v })} />
          <EditableField label="Designation" value={currentData.designation} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, designation: v })} />
          <EditableField label="Department" value={currentData.department} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, department: v })} />
        </div>
      </Section>

      <Section title="Overview">
        <StatsGrid stats={[
          ["Total Students", facultyData.totalStudents],
          ["Pending Reviews", facultyData.pendingReviews],
          ["Avg Completion", `${facultyData.avgCompletion}%`],
          ["Collaborations", facultyData.activeCollaborations],
        ]} />
      </Section>
    </ProfileCard>
  );
};

/* ==================== INDUSTRY PROFILE ==================== */
const IndustryProfile = ({ navigate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { showSuccess, showInfo } = useToast();
  
  const [profileData, setProfileData] = useState({
    companyName: industryData.companyName,
    industrySector: industryData.industrySector,
    companyAddress: industryData.companyAddress,
    contactPerson: industryData.contactPerson,
    email: industryData.email,
    phone: "+91 98765 43210",
    about: "Leading technology company focused on innovation.",
  });

  const [tempData, setTempData] = useState({ ...profileData });

  const handleEdit = () => { setTempData({ ...profileData }); setIsEditing(true); };
  const handleSave = () => { setProfileData({ ...tempData }); setIsEditing(false); showSuccess("Company profile updated!", "Saved"); };
  const handleCancel = () => { setTempData({ ...profileData }); setIsEditing(false); showInfo("Changes discarded", "Cancelled"); };

  const currentData = isEditing ? tempData : profileData;

  return (
    <ProfileCard>
      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
        <ProfileHeader
          initials={currentData.companyName}
          title={currentData.companyName}
          subtitle={currentData.industrySector}
          extra={currentData.companyAddress}
          icon={Building2}
          isEditing={isEditing}
          onNameChange={(v) => setTempData({ ...tempData, companyName: v })}
        />
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <motion.button onClick={handleSave} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-medium"><Save size={18} /> Save</motion.button>
              <motion.button onClick={handleCancel} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-[rgb(var(--background))] rounded-xl border border-[rgb(var(--border))]"><X size={18} /> Cancel</motion.button>
            </>
          ) : (
            <motion.button onClick={handleEdit} whileHover={{ scale: 1.05 }} className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-blue-500 text-white rounded-xl font-medium"><Edit3 size={18} /> Edit Profile</motion.button>
          )}
        </div>
      </div>

      <Section title="About">
        {isEditing ? (
          <textarea value={tempData.about} onChange={(e) => setTempData({ ...tempData, about: e.target.value })} rows={4} className="w-full px-4 py-3 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))] focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
        ) : (
          <p className="text-[rgb(var(--muted))]">{currentData.about}</p>
        )}
      </Section>

      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EditableField label="Contact Person" value={currentData.contactPerson} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, contactPerson: v })} />
          <EditableField label="Email" value={currentData.email} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, email: v })} />
          <EditableField label="Phone" value={currentData.phone} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, phone: v })} />
          <EditableField label="Industry Sector" value={currentData.industrySector} isEditing={isEditing} onChange={(v) => setTempData({ ...tempData, industrySector: v })} />
        </div>
      </Section>

      <Section title="Statistics">
        <StatsGrid stats={[
          ["Active Openings", industryData.activeOpenings],
          ["Applications", industryData.applications],
          ["Interns Approved", industryData.internsApproved],
          ["Active Listings", industryData.activeListings],
        ]} />
      </Section>
    </ProfileCard>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */
const ProfileCard = ({ children }) => (
  <div className="p-6 max-w-4xl mx-auto">
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl shadow-lg p-8 bg-[rgb(var(--surface))] border border-[rgb(var(--border))]">
      {children}
    </motion.div>
  </div>
);

const ProfileHeader = ({ initials, title, subtitle, extra, icon: Icon, isEditing, onNameChange }) => (
  <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-[rgb(var(--border))] flex-1">
    <div className="relative group">
      <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
        {initials.split(" ").map((n) => n[0]).join("")}
      </div>
      {isEditing && (
        <button className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera size={24} className="text-white" />
        </button>
      )}
      {Icon && !isEditing && (
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[rgb(var(--surface))] border-2 border-[rgb(var(--border))] flex items-center justify-center">
          <Icon size={16} className="text-blue-600" />
        </div>
      )}
    </div>
    <div className="text-center md:text-left flex-1">
      {isEditing ? (
        <input type="text" value={title} onChange={(e) => onNameChange(e.target.value)} className="text-2xl font-bold bg-transparent border-b-2 border-blue-500 outline-none text-[rgb(var(--foreground))]" />
      ) : (
        <h2 className="text-2xl font-bold text-[rgb(var(--foreground))]">{title}</h2>
      )}
      <p className="text-[rgb(var(--muted))] mt-1">{subtitle}</p>
      <p className="text-blue-600 dark:text-blue-400 mt-1 font-medium">{extra}</p>
    </div>
  </div>
);

const Section = ({ title, children }) => (
  <div className="mb-6">
    <h3 className="text-lg font-semibold text-[rgb(var(--foreground))] mb-3">{title}</h3>
    {children}
  </div>
);

const EditableField = ({ label, value, isEditing, onChange, type = "text" }) => (
  <div className="p-3 rounded-xl bg-[rgb(var(--background))]">
    <p className="text-xs text-[rgb(var(--muted))] mb-1">{label}</p>
    {isEditing ? (
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-transparent text-[rgb(var(--foreground))] font-medium outline-none border-b border-transparent focus:border-blue-500" />
    ) : (
      <p className="font-medium text-[rgb(var(--foreground))]">{value}</p>
    )}
  </div>
);

const StatsGrid = ({ stats }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {stats.map(([label, value]) => (
      <div key={label} className="rounded-xl p-4 text-center bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
        <p className="text-2xl font-bold bg-linear-to-r from-blue-600 to-green-400 bg-clip-text text-transparent">{value}</p>
        <p className="text-sm text-[rgb(var(--muted))] mt-1">{label}</p>
      </div>
    ))}
  </div>
);

const Modal = ({ children, onClose }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-6 max-w-md w-full border border-[rgb(var(--border))]" onClick={(e) => e.stopPropagation()}>
      {children}
    </motion.div>
  </motion.div>
);

export default ProfilePage;