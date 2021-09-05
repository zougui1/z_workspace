export const getDevicePath = (type: string, label: string): string => {
  switch (type) {
    case 'uuid':
      return `/dev/disk/by-uuid/${label}`;
    case 'label':
      return `/dev/disk/by-label/${label}`;
    case 'partLabel':
      return `/dev/disk/by-partlabel/${label}`;
    case 'device':
      return `/dev/${label}`;

    default:
      throw new Error(`Invalid device type, expected 'uuid', 'label', 'partLabel' or 'device'; got "${type}".`);
  }
}
