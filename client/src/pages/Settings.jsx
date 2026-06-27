import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiSave, FiCamera, FiX, FiCheck } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import useAuth from "../hooks/useAuth";
import { updatePreferences, uploadAvatar } from "../api/user";
import { GENRES, INDUSTRIES } from "../constants";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Settings = () => {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [description, setDescription] = useState("");

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form from user data
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setSelectedGenres(user.preferences?.genres || []);
      setSelectedIndustries(user.preferences?.industries || []);
      setDescription(user.preferences?.description || "");
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    if (!user) return;
    const nameChanged = name !== (user.name || "");
    const genresChanged =
      JSON.stringify(selectedGenres.sort()) !==
      JSON.stringify([...(user.preferences?.genres || [])].sort());
    const industriesChanged =
      JSON.stringify(selectedIndustries.sort()) !==
      JSON.stringify([...(user.preferences?.industries || [])].sort());
    const descChanged = description !== (user.preferences?.description || "");

    setHasChanges(
      nameChanged || genresChanged || industriesChanged || descChanged,
    );
  }, [user, name, selectedGenres, selectedIndustries, description]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  const toggleIndustry = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry)
        ? prev.filter((i) => i !== industry)
        : [...prev, industry],
    );
  };

const handleAvatarChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("avatar", file);

  setAvatarUploading(true);

  try {
    const promise = uploadAvatar(formData);

    toast.promise(promise, {
      loading: "Uploading...",
      success: "Avatar updated!",
      error: (err) =>
        err?.response?.data?.message || "Failed to upload avatar",
    });

    const res = await promise;

    setUser(res.user);
  } catch (err) {
    console.log(err)
  } finally {
    setAvatarUploading(false);
  }
};
  const handleSave = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setSaving(true);
    try {
      const res = await updatePreferences({
        genres: selectedGenres,
        industries: selectedIndustries,
        description: description.trim() || undefined,
      });

      setUser(res.user);
      toast.success("Profile updated successfully!");
      setHasChanges(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="min-h-screen pt-24 pb-16"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Section */}
        <motion.div
          variants={item}
          className="bg-surface border border-border/50 rounded-2xl p-6 sm:p-8 mb-6"
        >
          <h2 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-primary-light" />
            Profile
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                  <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden">
                    {user.avatar?.url ? (
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-8 h-8 text-text-muted" />
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 w-full h-full rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  {avatarUploading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCamera className="w-5 h-5 text-white" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name & Email */}
            <div className="flex-1 w-full space-y-4">
              <div className="relative">
                <Input
                  label="Email"
                  type="email"
                  value={user.name || ""}
                  disabled
                  icon={<FiMail className="w-4 h-4" />}
                />
                <span className="absolute right-3 top-[38px] text-[10px] text-text-muted bg-surface-light px-1.5 py-0.5 rounded">
                  Read only
                </span>
              </div>
              <div className="relative">
                <Input
                  label="Email"
                  type="email"
                  value={user.email || ""}
                  disabled
                  placeholder="Your email"
                  icon={<FiMail className="w-4 h-4" />}
                />
                <span className="absolute right-3 top-[38px] text-[10px] text-text-muted bg-surface-light px-1.5 py-0.5 rounded">
                  Read only
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Preferences Section */}
        <motion.div
          variants={item}
          className="bg-surface border border-border/50 rounded-2xl p-6 sm:p-8 mb-6"
        >
          <h2 className="text-lg font-semibold text-text mb-6 flex items-center gap-2">
            <HiOutlineSparkles className="w-5 h-5 text-secondary-light" />
            Movie Preferences
          </h2>
          <p className="text-sm text-text-muted mb-6">
            These preferences help AI recommend movies tailored to your taste.
          </p>

          {/* Genres */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-3">
              Favorite Genres
            </label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => {
                const isSelected = selectedGenres.includes(genre);
                return (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`
                      group relative text-sm px-3.5 py-2 rounded-xl border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-primary/15 border-primary/40 text-primary-light shadow-sm shadow-primary/10"
                          : "bg-surface-light/50 border-border/20 text-text-muted hover:text-text hover:border-border/50 hover:bg-surface-light"
                      }
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                      {genre}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Industries */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text mb-3">
              Preferred Industries
            </label>
            <div className="flex flex-wrap gap-2">
              {INDUSTRIES.map((industry) => {
                const isSelected = selectedIndustries.includes(industry);
                return (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => toggleIndustry(industry)}
                    className={`
                      group relative text-sm px-3.5 py-2 rounded-xl border transition-all duration-200
                      ${
                        isSelected
                          ? "bg-secondary/15 border-secondary/40 text-secondary-light shadow-sm shadow-secondary/10"
                          : "bg-surface-light/50 border-border/20 text-text-muted hover:text-text hover:border-border/50 hover:bg-surface-light"
                      }
                    `}
                  >
                    <span className="flex items-center gap-1.5">
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                      {industry}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Describe Your Taste{" "}
              <span className="text-text-muted font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="E.g. I love mind-bending sci-fi with great visuals and emotional depth..."
              rows={4}
              className="w-full bg-surface-light/50 border border-border/30 rounded-xl px-4 py-3 text-text placeholder-text-muted/40 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all resize-none"
            />
            <p className="text-xs text-text-muted mt-1.5">
              A short description helps AI understand your movie taste better.
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div variants={item} className="flex justify-end gap-3">
          {hasChanges && (
            <Button
              variant="ghost"
              onClick={() => {
                setName(user.name || "");
                setSelectedGenres(user.preferences?.genres || []);
                setSelectedIndustries(user.preferences?.industries || []);
                setDescription(user.preferences?.description || "");
              }}
            >
              <FiX className="w-4 h-4" />
              Reset
            </Button>
          )}
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!hasChanges || saving}
            icon={FiSave}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </motion.div>

        {/* Account Info */}
        <motion.div
          variants={item}
          className="mt-8 text-center text-xs text-text-muted border-t border-border/30 pt-6"
        >
          <p>
            Member since{" "}
            {new Date(user.createdAt || Date.now()).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              },
            )}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings;
