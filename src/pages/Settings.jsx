// src/pages/Settings.jsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  X, 
  Upload, 
  Eye, 
  EyeOff, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Mail,
  Smartphone,
  AlertTriangle,
  Check,
  User,
  Building2,
  GraduationCap
} from 'lucide-react';
import { studentData, facultyData, industryData } from '../data/mockData';
import { useToast } from "../context/ToastContext";

const SettingsPage = ({ userRole }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [saveSuccess, setSaveSuccess] = useState(null);
  const fileInputRef = useRef(null);

  // Get initial data based on role
  const getInitialData = () => {
    if (userRole === 'faculty') {
      return {
        name: facultyData.name,
        email: facultyData.email || 'prof.mehta@college.edu',
        phone: '+91 98765 43210',
        designation: facultyData.designation,
        department: facultyData.department,
        college: facultyData.college
      };
    } else if (userRole === 'industry') {
      return {
        companyName: industryData.companyName,
        email: industryData.email,
        phone: '+91 98765 43210',
        contactPerson: industryData.contactPerson,
        designation: industryData.contactDesignation,
        industrySector: industryData.industrySector,
        address: industryData.companyAddress
      };
    }
    return {
      name: studentData.name,
      email: studentData.email,
      phone: '+91 98765 43210',
      branch: studentData.branch,
      college: studentData.college,
      semester: '6th Semester',
      rollNumber: 'CS2021001'
    };
  };

  const [settings, setSettings] = useState(getInitialData());

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyDigest: false,
    applicationUpdates: true,
    newOpportunities: true,
    messages: true
  });

  const handleSave = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setSaveSuccess(field);
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file (PNG, JPG, GIF, etc.)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      setShowImagePreview(true);
    }
  };

  const confirmImageUpload = () => {
    setProfileImage(tempImage);
    setShowImagePreview(false);
    setTempImage(null);
    setSaveSuccess('profileImage');
    setTimeout(() => setSaveSuccess(null), 2000);
  };

  const cancelImageUpload = () => {
    if (tempImage) {
      URL.revokeObjectURL(tempImage);
    }
    setTempImage(null);
    setShowImagePreview(false);
  };

  const removeProfilePicture = () => {
    if (profileImage) {
      URL.revokeObjectURL(profileImage);
    }
    setProfileImage(null);
  };

  const getInitials = () => {
    if (userRole === 'faculty') return facultyData.name.split(' ').map(n => n[0]).join('');
    if (userRole === 'industry') return industryData.companyName.split(' ').map(n => n[0]).join('');
    return studentData.name.split(' ').map(n => n[0]).join('');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match!');
      return;
    }
    if (passwordData.new.length < 8) {
      alert('Password must be at least 8 characters long!');
      return;
    }
    alert('Password updated successfully!');
    setShowPasswordModal(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    alert('Account deletion request submitted. You will receive a confirmation email.');
    setShowDeleteModal(false);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getRoleIcon = () => {
    if (userRole === 'faculty') return GraduationCap;
    if (userRole === 'industry') return Building2;
    return User;
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-[rgb(var(--foreground))]">Settings</h2>
        <p className="text-[rgb(var(--muted))]">Manage your account settings and preferences</p>
      </div>

      <div className="space-y-6">
        {/* Profile Picture Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Camera className="w-5 h-5 text-blue-600" />
            <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">Profile Picture</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Profile Image Display */}
            <div className="relative group">
              {profileImage ? (
                <div className="relative">
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-[rgb(var(--border))]"
                  />
                  <button
                    onClick={removeProfilePicture}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                    title="Remove picture"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-600 to-green-400 flex items-center justify-center text-white font-bold text-2xl">
                  {getInitials()}
                </div>
              )}

              {/* Camera overlay on hover */}
              <button
                onClick={handleUploadClick}
                className="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera size={24} className="text-white" />
              </button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {/* Upload buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                onClick={handleUploadClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
              >
                <Upload size={18} />
                Upload New Picture
              </motion.button>
              {profileImage && (
                <button
                  onClick={removeProfilePicture}
                  className="px-5 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
                >
                  Remove Picture
                </button>
              )}
              <p className="text-xs text-[rgb(var(--muted))]">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </motion.div>

        {/* Account Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-green-600" />
            <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">Account Settings</h3>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <SettingsField
              label="Email Address"
              value={settings.email}
              onChange={(value) => setSettings(prev => ({ ...prev, email: value }))}
              onSave={() => handleSave('email', settings.email)}
              type="email"
              success={saveSuccess === 'email'}
            />

            {/* Phone */}
            <SettingsField
              label="Phone Number"
              value={settings.phone}
              onChange={(value) => setSettings(prev => ({ ...prev, phone: value }))}
              onSave={() => handleSave('phone', settings.phone)}
              type="tel"
              success={saveSuccess === 'phone'}
            />

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[rgb(var(--muted))] mb-2">
                Password
              </label>
              <div className="flex gap-3">
                <input
                  type="password"
                  value="••••••••••••"
                  disabled
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--background))] text-[rgb(var(--muted))]"
                />
                <motion.button
                  onClick={() => setShowPasswordModal(true)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-5 py-2.5 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] rounded-xl font-medium hover:bg-[rgb(var(--border))] transition-all"
                >
                  Change
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Role-Specific Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <RoleIcon className="w-5 h-5 text-purple-600" />
            <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">
              {userRole === 'student' ? 'Student Information' : 
               userRole === 'faculty' ? 'Faculty Information' : 'Company Information'}
            </h3>
          </div>

          <div className="space-y-5">
            {userRole === 'student' && (
              <>
                <SettingsField
                  label="Full Name"
                  value={settings.name}
                  onChange={(value) => setSettings(prev => ({ ...prev, name: value }))}
                  onSave={() => handleSave('name', settings.name)}
                  success={saveSuccess === 'name'}
                />
                <SettingsField
                  label="Branch"
                  value={settings.branch}
                  onChange={(value) => setSettings(prev => ({ ...prev, branch: value }))}
                  onSave={() => handleSave('branch', settings.branch)}
                  success={saveSuccess === 'branch'}
                />
                <SettingsField
                  label="College"
                  value={settings.college}
                  onChange={(value) => setSettings(prev => ({ ...prev, college: value }))}
                  onSave={() => handleSave('college', settings.college)}
                  success={saveSuccess === 'college'}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <SettingsField
                    label="Semester"
                    value={settings.semester}
                    onChange={(value) => setSettings(prev => ({ ...prev, semester: value }))}
                    onSave={() => handleSave('semester', settings.semester)}
                    success={saveSuccess === 'semester'}
                  />
                  <SettingsField
                    label="Roll Number"
                    value={settings.rollNumber}
                    onChange={(value) => setSettings(prev => ({ ...prev, rollNumber: value }))}
                    onSave={() => handleSave('rollNumber', settings.rollNumber)}
                    success={saveSuccess === 'rollNumber'}
                  />
                </div>
              </>
            )}

            {userRole === 'faculty' && (
              <>
                <SettingsField
                  label="Full Name"
                  value={settings.name}
                  onChange={(value) => setSettings(prev => ({ ...prev, name: value }))}
                  onSave={() => handleSave('name', settings.name)}
                  success={saveSuccess === 'name'}
                />
                <SettingsField
                  label="Designation"
                  value={settings.designation}
                  onChange={(value) => setSettings(prev => ({ ...prev, designation: value }))}
                  onSave={() => handleSave('designation', settings.designation)}
                  success={saveSuccess === 'designation'}
                />
                <SettingsField
                  label="Department"
                  value={settings.department}
                  onChange={(value) => setSettings(prev => ({ ...prev, department: value }))}
                  onSave={() => handleSave('department', settings.department)}
                  success={saveSuccess === 'department'}
                />
                <SettingsField
                  label="College"
                  value={settings.college}
                  onChange={(value) => setSettings(prev => ({ ...prev, college: value }))}
                  onSave={() => handleSave('college', settings.college)}
                  success={saveSuccess === 'college'}
                />
              </>
            )}

            {userRole === 'industry' && (
              <>
                <SettingsField
                  label="Company Name"
                  value={settings.companyName}
                  onChange={(value) => setSettings(prev => ({ ...prev, companyName: value }))}
                  onSave={() => handleSave('companyName', settings.companyName)}
                  success={saveSuccess === 'companyName'}
                />
                <SettingsField
                  label="Contact Person"
                  value={settings.contactPerson}
                  onChange={(value) => setSettings(prev => ({ ...prev, contactPerson: value }))}
                  onSave={() => handleSave('contactPerson', settings.contactPerson)}
                  success={saveSuccess === 'contactPerson'}
                />
                <SettingsField
                  label="Designation"
                  value={settings.designation}
                  onChange={(value) => setSettings(prev => ({ ...prev, designation: value }))}
                  onSave={() => handleSave('designation', settings.designation)}
                  success={saveSuccess === 'designation'}
                />
                <SettingsField
                  label="Industry Sector"
                  value={settings.industrySector}
                  onChange={(value) => setSettings(prev => ({ ...prev, industrySector: value }))}
                  onSave={() => handleSave('industrySector', settings.industrySector)}
                  success={saveSuccess === 'industrySector'}
                />
                <SettingsField
                  label="Company Address"
                  value={settings.address}
                  onChange={(value) => setSettings(prev => ({ ...prev, address: value }))}
                  onSave={() => handleSave('address', settings.address)}
                  success={saveSuccess === 'address'}
                />
              </>
            )}
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[rgb(var(--surface))] rounded-2xl p-6 border border-[rgb(var(--border))] shadow-sm"
        >
          <div className="flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-orange-600" />
            <h3 className="text-xl font-semibold text-[rgb(var(--foreground))]">Notification Settings</h3>
          </div>

          <div className="space-y-4">
            <NotificationToggle
              icon={Mail}
              title="Email Notifications"
              description="Receive email updates about your account"
              enabled={notifications.emailNotifications}
              onToggle={() => toggleNotification('emailNotifications')}
            />
            <NotificationToggle
              icon={Smartphone}
              title="Push Notifications"
              description="Receive push notifications on your device"
              enabled={notifications.pushNotifications}
              onToggle={() => toggleNotification('pushNotifications')}
            />
            <NotificationToggle
              icon={Globe}
              title="Weekly Digest"
              description="Receive weekly summary of your activities"
              enabled={notifications.weeklyDigest}
              onToggle={() => toggleNotification('weeklyDigest')}
            />
            <NotificationToggle
              icon={Bell}
              title="Application Updates"
              description="Get notified about application status changes"
              enabled={notifications.applicationUpdates}
              onToggle={() => toggleNotification('applicationUpdates')}
            />
            <NotificationToggle
              icon={Palette}
              title="New Opportunities"
              description="Get notified about new internship opportunities"
              enabled={notifications.newOpportunities}
              onToggle={() => toggleNotification('newOpportunities')}
            />
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-6 border-2 bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/30"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h3 className="text-xl font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
          </div>
          <p className="text-red-600/70 dark:text-red-400/70 mb-6">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <motion.button
            onClick={() => setShowDeleteModal(true)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all"
          >
            Delete Account
          </motion.button>
        </motion.div>
      </div>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {showImagePreview && tempImage && (
          <Modal onClose={cancelImageUpload}>
            <h3 className="text-xl font-bold text-[rgb(var(--foreground))] mb-6">
              Preview Profile Picture
            </h3>
            <div className="flex flex-col items-center gap-6">
              <img
                src={tempImage}
                alt="Preview"
                className="w-40 h-40 rounded-full object-cover border-4 border-[rgb(var(--border))]"
              />
              <p className="text-sm text-[rgb(var(--muted))] text-center">
                This is how your profile picture will look
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <motion.button
                onClick={confirmImageUpload}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
              >
                <Check size={18} />
                Use This Picture
              </motion.button>
              <button
                onClick={cancelImageUpload}
                className="px-6 py-3 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] rounded-xl font-semibold hover:bg-[rgb(var(--border))] transition-all"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Password Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <Modal onClose={() => setShowPasswordModal(false)}>
            <h3 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-6">
              Change Password
            </h3>
            <form onSubmit={handlePasswordChange} className="space-y-5">
              <PasswordField
                label="Current Password"
                value={passwordData.current}
                onChange={(value) => setPasswordData(prev => ({ ...prev, current: value }))}
                showPassword={showPassword.current}
                onToggleShow={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
              />
              <PasswordField
                label="New Password"
                value={passwordData.new}
                onChange={(value) => setPasswordData(prev => ({ ...prev, new: value }))}
                showPassword={showPassword.new}
                onToggleShow={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
              />
              <PasswordField
                label="Confirm New Password"
                value={passwordData.confirm}
                onChange={(value) => setPasswordData(prev => ({ ...prev, confirm: value }))}
                showPassword={showPassword.confirm}
                onToggleShow={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
              />
              <div className="flex gap-3 pt-2">
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Update Password
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] rounded-xl font-semibold hover:bg-[rgb(var(--border))] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={32} className="text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-2">
                Delete Account?
              </h3>
              <p className="text-[rgb(var(--muted))] mb-6">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-3 bg-[rgb(var(--background))] text-[rgb(var(--foreground))] border border-[rgb(var(--border))] rounded-xl font-semibold hover:bg-[rgb(var(--border))] transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={handleDeleteAccount}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </motion.button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ============ REUSABLE COMPONENTS ============ */

// Settings Field Component
const SettingsField = ({ label, value, onChange, onSave, type = 'text', success }) => (
  <div>
    <label className="block text-sm font-medium text-[rgb(var(--muted))] mb-2">
      {label}
    </label>
    <div className="flex gap-3">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-4 py-2.5 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      />
      <motion.button
        onClick={onSave}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-5 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 ${
          success 
            ? 'bg-green-600 text-white' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {success ? (
          <>
            <Check size={16} />
            Saved
          </>
        ) : (
          'Save'
        )}
      </motion.button>
    </div>
  </div>
);

// Notification Toggle Component
const NotificationToggle = ({ icon: Icon, title, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between p-4 rounded-xl bg-[rgb(var(--background))] border border-[rgb(var(--border))]">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
        <Icon size={20} className="text-blue-600 dark:text-blue-400" />
      </div>
      <div>
        <p className="font-medium text-[rgb(var(--foreground))]">{title}</p>
        <p className="text-sm text-[rgb(var(--muted))]">{description}</p>
      </div>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        className="sr-only peer"
      />
      <div className="w-11 h-6 bg-[rgb(var(--border))] peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

// Password Field Component
const PasswordField = ({ label, value, onChange, showPassword, onToggleShow }) => (
  <div>
    <label className="block text-sm font-medium text-[rgb(var(--muted))] mb-2">
      {label}
    </label>
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="••••••••"
        required
        className="w-full px-4 py-3 pr-12 rounded-xl border border-[rgb(var(--border))] bg-[rgb(var(--surface))] text-[rgb(var(--foreground))] placeholder-[rgb(var(--muted))] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] transition-colors"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
  </div>
);

// Modal Component
const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-[rgb(var(--surface))] rounded-2xl shadow-2xl p-8 max-w-md w-full border border-[rgb(var(--border))]"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  </motion.div>
);

export default SettingsPage;