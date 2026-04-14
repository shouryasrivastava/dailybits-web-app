import { useState } from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { getCurrentUser, setCurrentUser, updateUser } from "../utils/storage";
import { updateUserProfile } from "../utils/api";

export function UserProfilePage() {
  const currentUser = getCurrentUser();
  const token = localStorage.getItem("access_token");
  const accountNumber = currentUser?.accountNumber;

  const [profile, setProfile] = useState(() => getCurrentUser());
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  if (!token || !profile || !accountNumber) {
    return (
      <div className="h-full flex items-center justify-center bg-neutral-50">
        <p className="text-neutral-500">Please login first.</p>
      </div>
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    try {
      await updateUserProfile(accountNumber, firstName, lastName);

      const updatedUser = {
        ...profile,
        firstName,
        lastName,
      };

      setCurrentUser(updatedUser);
      updateUser(updatedUser);
      setProfile(updatedUser);

      setStatus({
        type: "success",
        message: "Profile updated successfully.",
      });
    } catch (err) {
      setStatus({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to update profile.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full flex flex-col bg-neutral-50">
      <div className="bg-white border-b border-neutral-200 p-6 min-h-[140px] flex flex-col justify-center">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-2">
          My Profile
        </h1>
        <p className="text-neutral-600">
          View your account details and update your profile
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarFallback className="bg-slate-600 text-white text-lg font-medium">
                  {(profile.firstName || "?")[0]}
                  {(profile.lastName || "")[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium text-neutral-900">
                  {profile.firstName} {profile.lastName}
                </p>
                <p className="text-sm text-neutral-500">
                  {profile.isAdmin ? "Admin" : "Student"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  Email
                </p>
                <p className="text-sm text-neutral-900 mt-1">{profile.email}</p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  Member Since
                </p>
                <p className="text-sm text-neutral-900 mt-1">
                  {profile.registerDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-neutral-500 uppercase tracking-wide">
                  Role
                </p>
                <p className="text-sm text-neutral-900 mt-1">
                  {profile.isAdmin ? "Admin" : "Student"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-base font-medium text-neutral-900 mb-4">
              Edit Name
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    className="text-sm text-neutral-700"
                    htmlFor="firstName"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label
                    className="text-sm text-neutral-700"
                    htmlFor="lastName"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                    required
                  />
                </div>
              </div>

              {status && (
                <p
                  className={`text-sm ${
                    status.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={saving}
                className="bg-slate-700 hover:bg-slate-800 text-white"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
