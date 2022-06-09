import React, { SVGProps } from 'react';

const Bolt = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M19.89 9.55004C19.8069 9.38513 19.6797 9.24645 19.5226 9.14937C19.3656 9.05229 19.1847 9.0006 19 9.00004H14V3.00004C14.0107 2.78073 13.949 2.56397 13.8243 2.38324C13.6996 2.20251 13.5188 2.06785 13.31 2.00004C13.1092 1.93399 12.8927 1.93324 12.6914 1.99792C12.4902 2.0626 12.3147 2.18937 12.19 2.36004L4.18998 13.36C4.08975 13.5049 4.02956 13.6737 4.01551 13.8493C4.00147 14.0249 4.03406 14.2011 4.10998 14.36C4.17991 14.5418 4.30137 14.6992 4.45947 14.8129C4.61757 14.9266 4.80543 14.9916 4.99998 15H9.99998V21C10.0001 21.2109 10.067 21.4164 10.1909 21.587C10.3148 21.7576 10.4895 21.8847 10.69 21.95C10.7905 21.9812 10.8948 21.998 11 22C11.1578 22.0005 11.3134 21.9635 11.4542 21.8923C11.595 21.821 11.7169 21.7174 11.81 21.59L19.81 10.59C19.9177 10.4408 19.9822 10.2648 19.9963 10.0813C20.0104 9.8978 19.9736 9.71397 19.89 9.55004ZM12 17.92V14C12 13.7348 11.8946 13.4805 11.7071 13.2929C11.5196 13.1054 11.2652 13 11 13H6.99998L12 6.08004V10C12 10.2653 12.1053 10.5196 12.2929 10.7071C12.4804 10.8947 12.7348 11 13 11H17L12 17.92Z"
      fill="currentColor"
    />
  </svg>
);

export default Bolt;
