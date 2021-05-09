import React from 'react';
import gfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import styled from '@emotion/styled';

const MarkdownContainer = styled.section`
    padding: 1rem;
    font-size: 15px;
    ol {
        margin: 0;
        li {
            padding: 0;
        }
    }
    a {
        color: #eee;
        &:hover {
            color: #ffc107;
        }
    }
`;

const MarkdownViewer = ({ content }) => {
    return (
        <MarkdownContainer>
            <ReactMarkdown
                plugins={[gfm]}
                children={content}
            />
        </MarkdownContainer>
    );
};

export default MarkdownViewer;
