import styles from "./PreviewProfile.module.css";

const PreviewProfile = ({ user }) => {
  console.log(user);
  return (
    <div className={styles.profilePreview}>
      {/* Banner Image */}
      <div
        className={styles.banner}
        style={{ backgroundImage: user.banner }}
      ></div>

      {/* Profile Picture */}
      <div className={styles.profilePicContainer}>
        <img
          src={user.profilePicture}
          alt={`Avatar de ${user.name}`}
          className={styles.profilePicture}
        />
      </div>

      {/* User Information */}
      <div className={styles.userInfo}>
        <h3 className={styles.name}>{user.name}</h3>
        <p className={styles.username}>@{user.username}</p>

        {/* Bio */}
        {user.bio && <p className={styles.bio}>{user.bio}</p>}

        {/* Stats (Followers, Following, etc.) */}
        <div className={styles.stats}>
          <p>
            <strong>{user.followers}</strong> Followers
          </p>
          <p>
            <strong>{user.following}</strong> Following
          </p>
        </div>

        {/* Join date */}
        <p className={styles.joined}>Joined {user.joined}</p>
      </div>
    </div>
  );
};

export default PreviewProfile;
