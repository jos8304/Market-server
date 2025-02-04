module.exports = (sequelize, DataTypes) => {
  const banner = sequelize.define("Banner", {
    imegeUrl: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    href: {
      type: DataTypes.STRING(300),
      allowNull: false,
    },
  });
  return banner;
};
