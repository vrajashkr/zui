import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { api } from 'api';
import TagDetails from 'components/TagDetails';
import React from 'react';

const mockImage = {
  Image: {
    RepoName: 'centos',
    Tag: '8',
    Digest: 'sha256:63a795ca90aa6e7cca60941e826810a4cd0a2e73ea02bf458241df2a5c973e29',
    LastUpdated: '2020-12-08T00:22:52.526672082Z',
    Size: '75183423',
    ConfigDigest: 'sha256:8dd57e171a61368ffcfde38045ddb6ed74a32950c271c1da93eaddfb66a77e78',
    Platform: {
      Os: 'linux',
      Arch: 'amd64'
    },
    Vendor: 'CentOS',
    History: [
      {
        Layer: {
          Size: '75181999',
          Digest: 'sha256:7a0437f04f83f084b7ed68ad9c4a4947e12fc4e1b006b38129bac89114ec3621',
          Score: null
        },
        HistoryDescription: {
          Created: '2020-12-08T00:22:52.526672082Z',
          CreatedBy:
            '/bin/sh -c #(nop) ADD file:bd7a2aed6ede423b719ceb2f723e4ecdfa662b28639c8429731c878e86fb138b in / ',
          Author: '',
          Comment: '',
          EmptyLayer: false
        }
      },
      {
        Layer: null,
        HistoryDescription: {
          Created: '2020-12-08T00:22:52.895811646Z',
          CreatedBy:
            '/bin/sh -c #(nop)  LABEL org.label-schema.schema-version=1.0 org.label-schema.name=CentOS Base Image org.label-schema.vendor=CentOS org.label-schema.license=GPLv2 org.label-schema.build-date=20201204',
          Author: '',
          Comment: '',
          EmptyLayer: true
        }
      },
      {
        Layer: null,
        HistoryDescription: {
          Created: '2020-12-08T00:22:53.076477777Z',
          CreatedBy: '/bin/sh -c #(nop)  CMD ["/bin/bash"]',
          Author: '',
          Comment: '',
          EmptyLayer: true
        }
      }
    ]
  }
};

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useParams: () => {
    return { name: 'test' };
  }
}));

beforeEach(() => {
  window.scrollTo = jest.fn();
});

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe('Tags details', () => {
  it('should show tabs and allow nagivation between them', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    const dependenciesTab = await screen.findByTestId('dependencies-tab');
    fireEvent.click(dependenciesTab);
    expect(await screen.findByTestId('depends-on-container')).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByRole('tab')).toHaveLength(4));
  });

  it("should log an error when data can't be fetched", async () => {
    jest.spyOn(api, 'get').mockRejectedValue({ status: 500, data: {} });
    const error = jest.spyOn(console, 'error').mockImplementation(() => {});
    render(<TagDetails />);
    await waitFor(() => expect(error).toBeCalledTimes(2));
  });
  it('should show tag details metadata', async () => {
    // @ts-ignore
    jest.spyOn(api, 'get').mockResolvedValue({ status: 200, data: { data: mockImage } });
    render(<TagDetails />);
    expect(await screen.findByTestId('tagDetailsMetadata-container')).toBeInTheDocument();
  });
});